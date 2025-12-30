/**
 * Middleware to require admin access
 * Must be used after protectRoute middleware
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - not authenticated" });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({
            message: "Forbidden - admin access required",
            isAdmin: false
        });
    }

    next();
};
