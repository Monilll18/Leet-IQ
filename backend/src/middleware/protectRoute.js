import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth?.userId;
      console.log("[Auth] ClerkID:", clerkId);

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      // if user is missing in our DB, fetch from Clerk and create on the fly
      // if user is missing in our DB, fetch from Clerk and create or link
      if (!user) {
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);
          const email = clerkUser.emailAddresses?.[0]?.emailAddress;

          // Check if user exists by email (prevent duplicate key error)
          user = await User.findOne({ email });

          if (user) {
            // User exists but has different/missing clerkId - Link them
            user.clerkId = clerkId;
            // Update other fields if missing
            if (!user.name) user.name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "Unnamed User";
            if (!user.profileImage) user.profileImage = clerkUser.imageUrl || "";
            await user.save();
            console.log(`[Auth] Linked existing user ${email} to new Clerk ID ${clerkId}`);
          } else {
            // Truly new user - Create
            user = await User.create({
              clerkId,
              email,
              name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "Unnamed User",
              profileImage: clerkUser.imageUrl || "",
            });
          }

          // sync to stream
          await upsertStreamUser({
            id: user.clerkId,
            name: user.name,
            image: user.profileImage,
          });
        } catch (createErr) {
          console.error("Error syncing Clerk user to DB:", createErr);
          // If concurrent requests created the user in between, try one last fetch
          user = await User.findOne({ clerkId });
          if (!user) {
            return res.status(500).json({ message: "Failed to sync user" });
          }
        }
      }

      // Check if user should be admin based on email
      const { env } = await import("../lib/env.js");
      const isAdminEmail = env.ADMIN_EMAILS.includes(user.email?.toLowerCase());

      // Update admin status if it changed
      if (user.isAdmin !== isAdminEmail || user.role !== (isAdminEmail ? 'admin' : 'user')) {
        user.isAdmin = isAdminEmail;
        user.role = isAdminEmail ? 'admin' : 'user';
        await user.save();
        console.log(`[Auth] Updated admin status for ${user.email}: ${isAdminEmail}`);
      }

      // Check if user is banned (admins cannot be banned)
      if (user.banned && !user.isAdmin) {
        return res.status(403).json({
          message: "Your account has been banned",
          banned: true,
          reason: user.bannedReason,
          bannedAt: user.bannedAt
        });
      }

      // attach user to req for downstream handlers
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
