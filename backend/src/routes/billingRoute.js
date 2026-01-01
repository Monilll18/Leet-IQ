import express from "express";
import User from "../models/User.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

/**
 * Clerk Billing Webhook Handler
 * Handles subscription events from Clerk/Stripe
 */
router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    try {
        // In production, verify the webhook signature
        // For now, we'll parse the event directly
        const event = JSON.parse(req.body.toString());

        console.log("[Billing Webhook] Received event:", event.type);

        switch (event.type) {
            case "checkout.session.completed": {
                // User completed checkout
                const session = event.data;
                const clerkUserId = session.client_reference_id || session.metadata?.clerk_user_id;
                const subscriptionId = session.subscription;
                const customerId = session.customer;

                if (clerkUserId) {
                    const plan = session.metadata?.plan || 'monthly';
                    const expiresAt = new Date();
                    expiresAt.setMonth(expiresAt.getMonth() + (plan === 'yearly' ? 12 : 1));

                    await User.findOneAndUpdate(
                        { clerkId: clerkUserId },
                        {
                            isPremium: true,
                            premiumPlan: plan,
                            premiumExpiresAt: expiresAt,
                            stripeCustomerId: customerId,
                            stripeSubscriptionId: subscriptionId
                        }
                    );
                    console.log(`[Billing] User ${clerkUserId} upgraded to ${plan} premium`);
                }
                break;
            }

            case "customer.subscription.updated": {
                // Subscription renewed or changed
                const subscription = event.data;
                const customerId = subscription.customer;

                const user = await User.findOne({ stripeCustomerId: customerId });
                if (user) {
                    const periodEnd = new Date(subscription.current_period_end * 1000);
                    await User.findByIdAndUpdate(user._id, {
                        premiumExpiresAt: periodEnd,
                        isPremium: subscription.status === 'active'
                    });
                    console.log(`[Billing] Subscription updated for user ${user.clerkId}`);
                }
                break;
            }

            case "customer.subscription.deleted": {
                // Subscription cancelled
                const subscription = event.data;
                const customerId = subscription.customer;

                await User.findOneAndUpdate(
                    { stripeCustomerId: customerId },
                    {
                        isPremium: false,
                        premiumPlan: null,
                        stripeSubscriptionId: null
                    }
                );
                console.log(`[Billing] Subscription cancelled for customer ${customerId}`);
                break;
            }

            default:
                console.log(`[Billing] Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error("[Billing Webhook Error]:", error);
        res.status(400).json({ error: "Webhook handler failed" });
    }
});

/**
 * Get user's premium status
 */
router.get("/status", protectRoute, async (req, res) => {
    try {
        const user = req.user;

        // Check if premium has expired
        let isPremium = user.isPremium;
        if (user.premiumExpiresAt && new Date() > new Date(user.premiumExpiresAt)) {
            isPremium = false;
            // Update user to non-premium
            await User.findByIdAndUpdate(user._id, { isPremium: false, premiumPlan: null });
        }

        // Check daily problem limit for free users
        let dailyProblemsRemaining = 5;
        const today = new Date().toDateString();
        const lastSolvedDate = user.lastProblemSolvedDate ? new Date(user.lastProblemSolvedDate).toDateString() : null;

        if (!isPremium) {
            if (lastSolvedDate === today) {
                dailyProblemsRemaining = Math.max(0, 5 - (user.dailyProblemsSolved || 0));
            } else {
                dailyProblemsRemaining = 5;
            }
        } else {
            dailyProblemsRemaining = -1; // Unlimited
        }

        res.status(200).json({
            isPremium,
            plan: user.premiumPlan,
            expiresAt: user.premiumExpiresAt,
            dailyProblemsRemaining,
            features: {
                unlimitedProblems: isPremium,
                hints: isPremium,
                companyTags: isPremium,
                privateContests: isPremium,
                detailedAnalytics: isPremium,
                adFree: isPremium,
                premiumBadge: isPremium
            }
        });
    } catch (error) {
        console.error("[Billing Status Error]:", error);
        res.status(500).json({ message: "Failed to get premium status" });
    }
});

/**
 * Get checkout URL for premium subscription
 * This is a placeholder - Clerk handles checkout via their SDK
 */
router.post("/create-checkout", protectRoute, async (req, res) => {
    try {
        const { plan } = req.body; // 'monthly' or 'yearly'
        const user = req.user;

        // In production, this would create a Stripe checkout session
        // For Clerk billing, the frontend uses Clerk's built-in checkout

        res.status(200).json({
            message: "Use Clerk checkout on frontend",
            plan,
            userId: user.clerkId
        });
    } catch (error) {
        console.error("[Checkout Error]:", error);
        res.status(500).json({ message: "Failed to create checkout" });
    }
});

export default router;
