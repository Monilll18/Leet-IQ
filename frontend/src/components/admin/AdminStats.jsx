import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../../api/admin";
import {
    UsersIcon,
    CodeIcon,
    TrophyIcon,
    CheckCircleIcon,
    CrownIcon,
    BanIcon,
    VideoIcon,
    ShoppingBagIcon,
    PackageIcon,
    TruckIcon,
    ActivityIcon,
    CoinsIcon,
    AlertCircleIcon
} from "lucide-react";

function AdminStats() {
    const { data: response, isLoading, error } = useQuery({
        queryKey: ["adminStats"],
        queryFn: getAdminStats,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-error">
                <AlertCircleIcon className="size-12 mb-4" />
                <p className="text-lg font-bold">Error fetching admin stats</p>
                <p className="text-sm opacity-70">{error.message}</p>
            </div>
        );
    }

    const stats = response?.stats || {};

    // User Stats
    const userStats = [
        { title: "Total Users", value: stats.totalUsers || 0, icon: UsersIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
        { title: "Active Users (30d)", value: stats.activeUsers || 0, icon: ActivityIcon, color: "text-green-500", bgColor: "bg-green-500/10" },
        { title: "Premium Users", value: stats.premiumUsers || 0, icon: CrownIcon, color: "text-amber-500", bgColor: "bg-amber-500/10" },
        { title: "Banned Users", value: stats.bannedUsers || 0, icon: BanIcon, color: "text-red-500", bgColor: "bg-red-500/10" },
    ];

    // Content Stats
    const contentStats = [
        { title: "Total Problems", value: stats.totalProblems || 0, icon: CodeIcon, color: "text-purple-500", bgColor: "bg-purple-500/10" },
        { title: "Total Contests", value: stats.totalContests || 0, icon: TrophyIcon, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
        { title: "Active Contests", value: stats.activeContests || 0, icon: TrophyIcon, color: "text-green-500", bgColor: "bg-green-500/10" },
        { title: "Upcoming Contests", value: stats.upcomingContests || 0, icon: TrophyIcon, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    ];

    // Activity Stats
    const activityStats = [
        { title: "Total Submissions", value: stats.totalSubmissions || 0, icon: CodeIcon, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
        { title: "Accepted", value: stats.acceptedSubmissions || 0, icon: CheckCircleIcon, color: "text-green-500", bgColor: "bg-green-500/10" },
        { title: "Acceptance Rate", value: `${stats.acceptanceRate || 0}%`, icon: CheckCircleIcon, color: "text-teal-500", bgColor: "bg-teal-500/10" },
        { title: "Total Sessions", value: stats.totalSessions || 0, icon: VideoIcon, color: "text-pink-500", bgColor: "bg-pink-500/10" },
    ];

    // Store Stats
    const storeStats = [
        { title: "Total Orders", value: stats.totalOrders || 0, icon: ShoppingBagIcon, color: "text-orange-500", bgColor: "bg-orange-500/10" },
        { title: "Pending Orders", value: stats.pendingOrders || 0, icon: PackageIcon, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
        { title: "Shipped Orders", value: stats.shippedOrders || 0, icon: TruckIcon, color: "text-green-500", bgColor: "bg-green-500/10" },
        { title: "Coins Spent", value: (stats.totalCoinsSpent || 0).toLocaleString(), icon: CoinsIcon, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    ];

    const StatCard = ({ stat }) => {
        const Icon = stat.icon;
        return (
            <div className="bg-base-300 rounded-2xl p-5 border border-base-content/10">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-base-content/60 text-xs font-medium">{stat.title}</p>
                        <p className="text-2xl font-black mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} p-2.5 rounded-xl`}>
                        <Icon className="size-5" />
                    </div>
                </div>
            </div>
        );
    };

    const StatsSection = ({ title, statsList }) => (
        <div className="mb-6">
            <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wide mb-3">{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statsList.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <StatsSection title="👥 Users" statsList={userStats} />
            <StatsSection title="📚 Content" statsList={contentStats} />
            <StatsSection title="⚡ Activity" statsList={activityStats} />
            <StatsSection title="🛒 Store" statsList={storeStats} />

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-base-300 rounded-2xl p-6 border border-base-content/10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <UsersIcon className="size-5 text-primary" />
                        Recent Users
                    </h3>
                    <div className="space-y-3">
                        {response?.recentUsers?.length > 0 ? (
                            response.recentUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-3 bg-base-100 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-8 rounded-full">
                                                <img
                                                    src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                                    alt={user.name}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{user.name}</p>
                                            <p className="text-xs text-base-content/60">{user.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-base-content/40">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-base-content/50 text-center py-4">No recent users</p>
                        )}
                    </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-base-300 rounded-2xl p-6 border border-base-content/10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <CodeIcon className="size-5 text-primary" />
                        Recent Submissions
                    </h3>
                    <div className="space-y-3">
                        {response?.recentSubmissions?.length > 0 ? (
                            response.recentSubmissions.slice(0, 5).map((submission) => (
                                <div
                                    key={submission._id}
                                    className="flex items-center justify-between p-3 bg-base-100 rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold text-sm">{submission.userId?.name || 'Unknown'}</p>
                                        <p className="text-xs text-base-content/60">{submission.problemId}</p>
                                    </div>
                                    <span
                                        className={`badge badge-sm ${submission.status === "Accepted" ? "badge-success" : "badge-error"}`}
                                    >
                                        {submission.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-base-content/50 text-center py-4">No recent submissions</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminStats;
