import User from "../models/User.js";
import ContestSubmission from "../models/ContestSubmission.js";
import Contest from "../models/Contest.js";

/**
 * Get platform statistics for admin dashboard
 */
export const getStats = async (req, res) => {
    try {
        // Helper function to safely count documents
        const safeCount = async (model, query = {}) => {
            try {
                return await model.countDocuments(query);
            } catch (e) {
                console.error(`Error counting ${model.modelName}:`, e.message);
                return 0;
            }
        };

        // Import models dynamically with error handling
        let Problem, Session, Order;
        try {
            Problem = (await import("../models/Problem.js")).default;
        } catch (e) {
            console.error("Failed to import Problem model:", e.message);
        }
        try {
            Session = (await import("../models/Session.js")).default;
        } catch (e) {
            console.error("Failed to import Session model:", e.message);
        }
        try {
            Order = (await import("../models/StoreOrder.js")).default;
        } catch (e) {
            console.error("Failed to import StoreOrder model:", e.message);
        }

        // Basic counts
        const totalUsers = await safeCount(User);
        const totalSubmissions = await safeCount(ContestSubmission);
        const totalContests = await safeCount(Contest);
        const totalProblems = Problem ? await safeCount(Problem, { isActive: true }) : 0;
        const totalSessions = Session ? await safeCount(Session) : 0;
        const totalOrders = Order ? await safeCount(Order) : 0;

        // Active users (users who have logged in within 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = await safeCount(User, { lastLogin: { $gte: thirtyDaysAgo } });

        // Premium users count
        const premiumUsers = await safeCount(User, { isPremium: true });

        // Banned users count
        const bannedUsers = await safeCount(User, { banned: true });

        // Contest stats
        const activeContests = await safeCount(Contest, { status: 'active' });
        const upcomingContests = await safeCount(Contest, { status: 'upcoming' });

        // Order stats
        const pendingOrders = Order ? await safeCount(Order, { status: 'pending' }) : 0;
        const shippedOrders = Order ? await safeCount(Order, { status: 'shipped' }) : 0;

        // Get recent activity
        let recentUsers = [];
        try {
            recentUsers = await User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email createdAt profileImage');
        } catch (e) {
            console.error("Error fetching recent users:", e.message);
        }

        let recentSubmissions = [];
        try {
            recentSubmissions = await ContestSubmission.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('userId', 'name email')
                .select('problemId status runtime memory createdAt');
        } catch (e) {
            console.error("Error fetching recent submissions:", e.message);
        }

        // Get acceptance rates
        const acceptedSubmissions = await safeCount(ContestSubmission, { status: 'Accepted' });
        const acceptanceRate = totalSubmissions > 0
            ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
            : 0;

        // Revenue from orders (total coins spent)
        let totalCoinsSpent = 0;
        if (Order) {
            try {
                const revenueAgg = await Order.aggregate([
                    { $match: { status: { $ne: 'cancelled' } } },
                    { $group: { _id: null, totalCoins: { $sum: '$totalPrice' } } }
                ]);
                totalCoinsSpent = revenueAgg[0]?.totalCoins || 0;
            } catch (e) {
                console.error("Error calculating revenue:", e.message);
            }
        }

        res.status(200).json({
            stats: {
                totalUsers,
                activeUsers,
                premiumUsers,
                bannedUsers,
                totalSubmissions,
                acceptedSubmissions,
                totalContests,
                activeContests,
                upcomingContests,
                totalProblems,
                totalSessions,
                totalOrders,
                pendingOrders,
                shippedOrders,
                acceptanceRate,
                totalCoinsSpent,
            },
            recentUsers,
            recentSubmissions,
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch statistics", error: error.message });
    }
};

/**
 * Get all users with pagination and search
 */
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const skip = (page - 1) * limit;

        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        const total = await User.countDocuments(query);

        res.status(200).json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

/**
 * Get all contests
 */
export const getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find()
            .sort({ createdAt: -1 });

        // Transform contests from DB format to frontend format
        const transformedContests = contests.map(contest => ({
            ...contest.toObject(),
            name: contest.title,        // title → name
            startDate: contest.startTime,  // startTime → startDate  
            endDate: contest.endTime,      // endTime → endDate
            problems: contest.problems.map(p => p.problemId), // Extract just IDs
        }));

        res.status(200).json({ contests: transformedContests });
    } catch (error) {
        console.error("Error fetching contests:", error);
        res.status(500).json({ message: "Failed to fetch contests" });
    }
};

/**
 * Get all problems
 */
export const getAllProblems = async (req, res) => {
    try {
        const { default: Problem } = await import("../models/Problem.js");

        const problems = await Problem.find({ isActive: true })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({ problems });
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ message: "Failed to fetch problems" });
    }
};

/**
 * Create a new problem
 */
export const createProblem = async (req, res) => {
    try {
        const { default: Problem } = await import("../models/Problem.js");

        const problemData = {
            ...req.body,
            createdBy: req.user._id,
        };

        // Check if problem ID already exists
        const existing = await Problem.findOne({ id: problemData.id });
        if (existing) {
            return res.status(409).json({ message: "Problem ID already exists" });
        }

        const problem = await Problem.create(problemData);

        res.status(201).json({
            message: "Problem created successfully",
            problem
        });
    } catch (error) {
        console.error("Error creating problem:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({
            message: "Failed to create problem",
            error: error.message
        });
    }
};

/**
 * Update an existing problem
 */
export const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { default: Problem } = await import("../models/Problem.js");

        const problem = await Problem.findOneAndUpdate(
            { id },
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.status(200).json({
            message: "Problem updated successfully",
            problem
        });
    } catch (error) {
        console.error("Error updating problem:", error);
        res.status(500).json({ message: "Failed to update problem" });
    }
};

/**
 * Delete a problem
 */
export const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { default: Problem } = await import("../models/Problem.js");

        // Soft delete by setting isActive to false
        const problem = await Problem.findOneAndUpdate(
            { id },
            { isActive: false },
            { new: true }
        );

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.status(200).json({ message: "Problem deleted successfully" });
    } catch (error) {
        console.error("Error deleting problem:", error);
        res.status(500).json({ message: "Failed to delete problem" });
    }
};

/**
 * Ban a user
 */
export const banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent banning admins
        if (user.isAdmin) {
            return res.status(403).json({ message: "Cannot ban admin users" });
        }

        user.banned = true;
        user.bannedReason = reason || "No reason provided";
        user.bannedAt = new Date();
        await user.save();

        // Reject any pending appeals from this user (they're being re-banned)
        const { default: BanAppeal } = await import("../models/BanAppeal.js");
        await BanAppeal.updateMany(
            { userId: userId, status: 'pending' },
            {
                status: 'rejected',
                adminResponse: 'Your appeal was rejected. You have been banned again.',
                reviewedBy: req.user._id,
                reviewedAt: new Date()
            }
        );

        res.status(200).json({
            message: "User banned successfully",
            user
        });
    } catch (error) {
        console.error("Error banning user:", error);
        res.status(500).json({ message: "Failed to ban user" });
    }
};

/**
 * Unban a user
 */
export const unbanUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.banned = false;
        user.bannedReason = null;
        user.bannedAt = null;
        await user.save();

        // Also approve any pending appeals from this user
        const { default: BanAppeal } = await import("../models/BanAppeal.js");
        await BanAppeal.updateMany(
            { userId: userId, status: 'pending' },
            {
                status: 'approved',
                adminResponse: 'Your ban has been lifted by an administrator.',
                reviewedBy: req.user._id,
                reviewedAt: new Date()
            }
        );

        res.status(200).json({
            message: "User unbanned successfully",
            user
        });
    } catch (error) {
        console.error("Error unbanning user:", error);
        res.status(500).json({ message: "Failed to unban user" });
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent deleting admins
        if (user.isAdmin) {
            return res.status(403).json({ message: "Cannot delete admin users" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

/**
 * Create a new contest
 */
export const createContest = async (req, res) => {
    try {
        const { name, description, startDate, endDate, problems, isPublic } = req.body;

        if (!name || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Transform problems array to match schema {problemId, score}
        const formattedProblems = (problems || []).map(problemId => ({
            problemId: problemId,
            score: 100
        }));

        const contest = await Contest.create({
            title: name,  // Model uses 'title'
            description,
            startTime: new Date(startDate),  // Model uses 'startTime'
            endTime: new Date(endDate),  // Model uses 'endTime'
            problems: formattedProblems,
            status: new Date(startDate) > new Date() ? 'upcoming' : 'active',
        });

        res.status(201).json({
            message: "Contest created successfully",
            contest
        });
    } catch (error) {
        console.error("Error creating contest:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                error: error.message
            });
        }
        res.status(500).json({ message: "Failed to create contest" });
    }
};

/**
 * Update a contest
 */
export const updateContest = async (req, res) => {
    try {
        const { contestId } = req.params;
        const { name, description, startDate, endDate, problems } = req.body;

        // Transform problems array
        const formattedProblems = (problems || []).map(problemId => ({
            problemId: problemId,
            score: 100
        }));

        const updates = {
            title: name,
            description,
            startTime: startDate ? new Date(startDate) : undefined,
            endTime: endDate ? new Date(endDate) : undefined,
            problems: formattedProblems,
        };

        // Remove undefined values
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const contest = await Contest.findByIdAndUpdate(
            contestId,
            updates,
            { new: true, runValidators: true }
        );

        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        res.status(200).json({
            message: "Contest updated successfully",
            contest
        });
    } catch (error) {
        console.error("Error updating contest:", error);
        res.status(500).json({ message: "Failed to update contest" });
    }
};

/**
 * Delete a contest
 */
export const deleteContest = async (req, res) => {
    try {
        const { contestId } = req.params;

        const contest = await Contest.findByIdAndDelete(contestId);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        // Also delete all submissions for this contest
        await ContestSubmission.deleteMany({ contestId });

        res.status(200).json({ message: "Contest and related submissions deleted successfully" });
    } catch (error) {
        console.error("Error deleting contest:", error);
        res.status(500).json({ message: "Failed to delete contest" });
    }
};

/**
 * Get all sessions (for session management)
 */
export const getAllSessions = async (req, res) => {
    try {
        // Import Session model dynamically to avoid circular dependencies
        const { default: Session } = await import("../models/Session.js");

        const sessions = await Session.find()
            .sort({ createdAt: -1 })
            .populate('host', 'name email profileImage')
            .populate('participant', 'name email profileImage')
            .limit(50);

        res.status(200).json({ sessions });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ message: "Failed to fetch sessions" });
    }
};

/**
 * Delete/terminate a session
 */
export const deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const { default: Session } = await import("../models/Session.js");

        const session = await Session.findByIdAndDelete(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.status(200).json({ message: "Session terminated successfully" });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ message: "Failed to delete session" });
    }
};

/**
 * Get all ban appeals
 */
export const getAllAppeals = async (req, res) => {
    try {
        const { default: BanAppeal } = await import("../models/BanAppeal.js");

        const appeals = await BanAppeal.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email profileImage')
            .populate('reviewedBy', 'name email');

        res.status(200).json({ appeals });
    } catch (error) {
        console.error("Error fetching appeals:", error);
        res.status(500).json({ message: "Failed to fetch appeals" });
    }
};

/**
 * Approve a ban appeal and unban user
 */
export const approveAppeal = async (req, res) => {
    try {
        const { appealId } = req.params;
        const { response } = req.body;

        const { default: BanAppeal } = await import("../models/BanAppeal.js");

        const appeal = await BanAppeal.findById(appealId);
        if (!appeal) {
            return res.status(404).json({ message: "Appeal not found" });
        }

        // Unban the user
        const user = await User.findById(appeal.userId);
        if (user) {
            user.banned = false;
            user.bannedReason = null;
            user.bannedAt = null;
            await user.save();
        }

        // Update appeal
        appeal.status = 'approved';
        appeal.adminResponse = response || "Your appeal has been approved.";
        appeal.reviewedBy = req.user._id;
        appeal.reviewedAt = new Date();
        await appeal.save();

        res.status(200).json({
            message: "Appeal approved and user unbanned",
            appeal
        });
    } catch (error) {
        console.error("Error approving appeal:", error);
        res.status(500).json({ message: "Failed to approve appeal" });
    }
};

/**
 * Reject a ban appeal
 */
export const rejectAppeal = async (req, res) => {
    try {
        const { appealId } = req.params;
        const { response } = req.body;

        const { default: BanAppeal } = await import("../models/BanAppeal.js");

        const appeal = await BanAppeal.findById(appealId);
        if (!appeal) {
            return res.status(404).json({ message: "Appeal not found" });
        }

        appeal.status = 'rejected';
        appeal.adminResponse = response || "Your appeal has been rejected.";
        appeal.reviewedBy = req.user._id;
        appeal.reviewedAt = new Date();
        await appeal.save();

        res.status(200).json({
            message: "Appeal rejected",
            appeal
        });
    } catch (error) {
        console.error("Error rejecting appeal:", error);
        res.status(500).json({ message: "Failed to reject appeal" });
    }
};
