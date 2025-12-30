import express from "express";
import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

const router = express.Router();

/**
 * Custom auth middleware for appeals - allows banned users
 */
const appealAuth = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth?.userId;

            if (!clerkId) {
                return res.status(401).json({ message: "Unauthorized - invalid token" });
            }

            // Find user in db by clerk ID
            let user = await User.findOne({ clerkId });

            // If user is missing in our DB, fetch from Clerk and create on the fly
            if (!user) {
                try {
                    const clerkUser = await clerkClient.users.getUser(clerkId);

                    user = await User.create({
                        clerkId,
                        email: clerkUser.emailAddresses?.[0]?.emailAddress,
                        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
                            clerkUser.username ||
                            "Unnamed User",
                        profileImage: clerkUser.imageUrl || "",
                    });
                } catch (createErr) {
                    console.error("Error syncing Clerk user to DB:", createErr);
                    return res.status(404).json({ message: "User not found" });
                }
            }

            // Attach user to req WITHOUT checking ban status
            // This allows banned users to submit appeals
            req.user = user;

            next();
        } catch (error) {
            console.error("Error in appealAuth middleware", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
];

/**
 * Submit a ban appeal
 * This route is accessible even to banned users
 */
router.post("/submit", appealAuth, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Appeal message is required" });
        }

        // Only allow banned users to submit appeals
        if (!req.user.banned) {
            return res.status(400).json({ message: "Only banned users can submit appeals" });
        }

        const { default: BanAppeal } = await import("../models/BanAppeal.js");

        // Check if user already has a pending appeal
        const existingAppeal = await BanAppeal.findOne({
            userId: req.user._id,
            status: 'pending'
        });

        if (existingAppeal) {
            return res.status(409).json({
                message: "You already have a pending appeal",
                appeal: existingAppeal
            });
        }

        const appeal = await BanAppeal.create({
            userId: req.user._id,
            userEmail: req.user.email,
            userName: req.user.name,
            message: message.trim(),
        });

        res.status(201).json({
            message: "Appeal submitted successfully. An admin will review it soon.",
            appeal
        });
    } catch (error) {
        console.error("Error submitting appeal:", error);
        res.status(500).json({ message: "Failed to submit appeal" });
    }
});

export default router;
