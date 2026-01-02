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
 * Fetches subscription status directly from Clerk's Billing API
 */
router.get("/status", protectRoute, async (req, res) => {
    try {
        const user = req.user;
        const clerkId = user.clerkId;
        const clerkSecretKey = process.env.CLERK_SECRET_KEY;

        let isPremium = false;
        let activePlan = null;
        let expiresAt = null;

        // Fetch subscription status from Clerk User Metadata
        if (clerkSecretKey && clerkId) {
            try {
                console.log(`[Billing] Fetching user data for ${clerkId}`);

                // Get user data from Clerk (correct endpoint)
                const userResponse = await fetch(
                    `https://api.clerk.com/v1/users/${clerkId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${clerkSecretKey}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(`[Billing] Clerk API status: ${userResponse.status}`);

                if (userResponse.ok) {
                    const clerkUser = await userResponse.json();

                    // Clerk stores subscription info in metadata after checkout
                    const publicMeta = clerkUser.public_metadata || {};
                    const privateMeta = clerkUser.private_metadata || {};

                    console.log(`[Billing] Public metadata keys:`, Object.keys(publicMeta));
                    console.log(`[Billing] Private metadata keys:`, Object.keys(privateMeta));
                    console.log(`[Billing] Public metadata:`, JSON.stringify(publicMeta));
                    console.log(`[Billing] Private metadata:`, JSON.stringify(privateMeta));

                    // STRICT check - only consider premium if EXPLICITLY set
                    // Must have one of these exact fields set to 'active' or true
                    const hasActiveSubscription =
                        publicMeta.subscriptionStatus === 'active' ||
                        privateMeta.subscriptionStatus === 'active' ||
                        publicMeta.subscription_status === 'active' ||
                        privateMeta.subscription_status === 'active' ||
                        publicMeta.isPremium === true ||
                        privateMeta.isPremium === true;

                    // Debug: Show exactly what triggered premium
                    if (hasActiveSubscription) {
                        console.log(`[Billing] ⚠️ SUBSCRIPTION DETECTED! Reason:`);
                        if (publicMeta.subscriptionStatus === 'active') console.log(`  - publicMeta.subscriptionStatus = 'active'`);
                        if (privateMeta.subscriptionStatus === 'active') console.log(`  - privateMeta.subscriptionStatus = 'active'`);
                        if (publicMeta.subscription_status === 'active') console.log(`  - publicMeta.subscription_status = 'active'`);
                        if (privateMeta.subscription_status === 'active') console.log(`  - privateMeta.subscription_status = 'active'`);
                        if (publicMeta.isPremium === true) console.log(`  - publicMeta.isPremium = true`);
                        if (privateMeta.isPremium === true) console.log(`  - privateMeta.isPremium = true`);
                    }

                    console.log(`[Billing] Has active subscription:`, hasActiveSubscription ? 'YES' : 'NO');

                    if (hasActiveSubscription) {
                        isPremium = true;
                        activePlan = publicMeta.plan || privateMeta.plan || 'monthly';

                        // Try to get expiration from metadata
                        const expiryTimestamp = publicMeta.subscriptionExpiry || privateMeta.subscriptionExpiry;
                        expiresAt = expiryTimestamp ? new Date(expiryTimestamp) : null;

                        // Sync to database if not already synced
                        if (!user.isPremium) {
                            await User.findByIdAndUpdate(user._id, {
                                isPremium: true,
                                premiumPlan: activePlan,
                                premiumExpiresAt: expiresAt
                            });
                            console.log(`[Billing] ✅ Synced premium from Clerk metadata for ${clerkId}`);
                        } else {
                            console.log(`[Billing] User ${clerkId} already marked as premium in DB`);
                        }
                    } else {
                        // NO subscription in Clerk metadata
                        // Check if user has valid premium in database (from manual activation)
                        const hasValidDbPremium = user.isPremium &&
                            user.premiumExpiresAt &&
                            new Date(user.premiumExpiresAt) > new Date();

                        if (hasValidDbPremium) {
                            // User was manually activated and still valid - keep premium
                            isPremium = true;
                            activePlan = user.premiumPlan;
                            expiresAt = user.premiumExpiresAt;
                            console.log(`[Billing] User ${clerkId} has valid DB premium (expires: ${expiresAt})`);
                        } else {
                            // No Clerk subscription AND no valid DB premium - enforce free
                            isPremium = false;
                            activePlan = null;
                            expiresAt = null;

                            if (user.isPremium) {
                                await User.findByIdAndUpdate(user._id, {
                                    isPremium: false,
                                    premiumPlan: null,
                                    premiumExpiresAt: null
                                });
                                console.log(`[Billing] ❌ Revoked premium for ${clerkId} - no subscription and expired`);
                            } else {
                                console.log(`[Billing] User ${clerkId} is free`);
                            }
                        }
                    }
                } else {
                    const errorText = await userResponse.text();
                    console.log(`[Billing] Clerk API error response:`, errorText);
                    // API call failed, fall back to database
                    console.log(`[Billing] Clerk API returned ${userResponse.status}, using database`);
                    isPremium = user.isPremium || false;
                    activePlan = user.premiumPlan;
                    expiresAt = user.premiumExpiresAt;
                }
            } catch (clerkError) {
                console.error("[Billing] Clerk API error:", clerkError);
                isPremium = user.isPremium || false;
                activePlan = user.premiumPlan;
                expiresAt = user.premiumExpiresAt;
            }
        } else {
            console.log(`[Billing] Missing Clerk credentials - clerkSecretKey: ${!!clerkSecretKey}, clerkId: ${!!clerkId}`);
            // No Clerk secret, use database
            isPremium = user.isPremium || false;
            activePlan = user.premiumPlan;
            expiresAt = user.premiumExpiresAt;
        }

        // Check if premium expired (database fallback)
        if (!isPremium && user.premiumExpiresAt && new Date() > new Date(user.premiumExpiresAt)) {
            await User.findByIdAndUpdate(user._id, { isPremium: false, premiumPlan: null });
        }

        // Daily limits for free users
        const today = new Date().toDateString();
        let dailyProblemsRemaining = isPremium ? -1 : 5;
        let dailySessionsRemaining = isPremium ? -1 : 3;

        if (!isPremium) {
            const lastSolvedDate = user.lastProblemSolvedDate
                ? new Date(user.lastProblemSolvedDate).toDateString()
                : null;
            if (lastSolvedDate === today) {
                dailyProblemsRemaining = Math.max(0, 5 - (user.dailyProblemsSolved || 0));
            }

            const lastSessionDate = user.lastSessionCreatedDate
                ? new Date(user.lastSessionCreatedDate).toDateString()
                : null;
            if (lastSessionDate === today) {
                dailySessionsRemaining = Math.max(0, 3 - (user.dailySessionsCreated || 0));
            }
        }

        res.status(200).json({
            isPremium,
            plan: activePlan,
            expiresAt,
            dailyProblemsRemaining,
            dailySessionsRemaining,
            features: {
                unlimitedProblems: isPremium,
                hints: isPremium,
                companyTags: isPremium,
                privateContests: isPremium,
                detailedAnalytics: isPremium,
                adFree: isPremium,
                premiumBadge: isPremium,
                submissionResults: isPremium
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

/**
 * Manual sync/activate premium status
 * Used when webhooks aren't configured or for testing
 */
router.post("/sync-premium", protectRoute, async (req, res) => {
    try {
        const user = req.user;
        const { activate, plan = 'monthly' } = req.body;

        if (activate === true) {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + (plan === 'yearly' ? 12 : 1));

            await User.findByIdAndUpdate(user._id, {
                isPremium: true,
                premiumPlan: plan,
                premiumExpiresAt: expiresAt
            });

            res.status(200).json({
                success: true,
                message: "Premium activated",
                isPremium: true,
                plan,
                expiresAt
            });
        } else {
            await User.findByIdAndUpdate(user._id, {
                isPremium: false,
                premiumPlan: null,
                premiumExpiresAt: null
            });

            res.status(200).json({
                success: true,
                message: "Premium deactivated",
                isPremium: false
            });
        }
    } catch (error) {
        console.error("[Sync Premium Error]:", error);
        res.status(500).json({ message: "Failed to sync premium status" });
    }
});

export default router;
