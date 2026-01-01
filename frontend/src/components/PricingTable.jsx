import { useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { usePremium } from "../hooks/usePremium";
import {
    CheckIcon,
    PlusIcon,
    MinusIcon
} from "lucide-react";

// Dynamic pricing from environment variables
const MONTHLY_PRICE = parseFloat(import.meta.env.VITE_PREMIUM_MONTHLY_PRICE || "14.92");
const YEARLY_PRICE = parseFloat(import.meta.env.VITE_PREMIUM_YEARLY_PRICE || "99.99");

function PricingTable() {
    const [isYearly, setIsYearly] = useState(true);
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const { isSignedIn } = useAuth();
    const clerk = useClerk();
    const { isPremium } = usePremium();

    const displayPrice = isYearly ? (YEARLY_PRICE / 12).toFixed(2) : MONTHLY_PRICE;

    const FEATURES_LIST = [
        "Unlimited Access",
        "Smart Hints (3 per Problem)",
        "Video Explanations",
        "Company Tags (Google, Meta...)",
        "Analytics Dashboard",
        "Ad-Free Experience",
        "Private Contests",
        "Premium Badge"
    ];

    const handleSubscribe = async () => {
        if (!isSignedIn) {
            window.location.href = "/sign-in?redirect_url=/premium";
            return;
        }

        const PLAN_ID = import.meta.env.VITE_CLERK_PLAN_ID;

        try {
            // Directly open Clerk's billing checkout modal
            if (clerk.openCheckout && PLAN_ID) {
                await clerk.openCheckout({
                    planId: PLAN_ID,
                    planPeriod: isYearly ? "annual" : "monthly",
                    afterSignUpUrl: window.location.origin + "/premium?success=true",
                    afterSignInUrl: window.location.origin + "/premium?success=true"
                });
            } else if (clerk.redirectToCheckout && PLAN_ID) {
                // Fallback: redirect to checkout page
                await clerk.redirectToCheckout({
                    planId: PLAN_ID,
                    planPeriod: isYearly ? "annual" : "monthly",
                    redirectUrl: window.location.origin + "/premium?success=true"
                });
            } else {
                // Last resort: open user profile
                clerk.openUserProfile();
            }
        } catch (error) {
            console.error("Checkout error:", error);
            // Fallback to user profile on error
            clerk.openUserProfile();
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-center gap-6 items-stretch max-w-4xl mx-auto">
            {/* Free Card */}
            <div className="card w-full md:w-[350px] bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                        <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-md">
                            Active
                        </span>
                    </div>

                    <div className="mb-3">
                        <span className="text-5xl font-bold text-gray-900">$0</span>
                    </div>

                    <p className="text-gray-500 text-sm mb-8">Always free</p>

                    {/* Empty space to match layout */}
                    <div className="flex-grow"></div>
                </div>
            </div>

            {/* Premium Card - Matches Clerk's design */}
            <div className="card w-full md:w-[350px] bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Leet IQ plan</h3>

                    <div className="flex items-baseline mb-3">
                        <span className="text-5xl font-bold text-gray-900">${displayPrice}</span>
                        <span className="text-gray-500 ml-2 text-lg">/month</span>
                    </div>

                    {/* Billing Toggle - Matches Clerk's style */}
                    <div className="flex items-center gap-3 mb-8">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isYearly}
                                onChange={() => setIsYearly(!isYearly)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                        </label>
                        <span className="text-gray-700 text-sm font-medium">Billed annually</span>
                    </div>

                    <div className="border-t border-gray-200 mb-6"></div>

                    {/* Features List - Clerk style */}
                    <ul className="space-y-4 mb-6">
                        {(showAllFeatures ? FEATURES_LIST : FEATURES_LIST.slice(0, 3)).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <CheckIcon className="size-5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* See all features toggle */}
                    <button
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                        className="flex items-center gap-2 text-gray-600 text-sm font-medium hover:text-gray-900 mb-8 transition-colors"
                    >
                        {showAllFeatures ? (
                            <>
                                <MinusIcon className="size-4" />
                                <span>Show fewer features</span>
                            </>
                        ) : (
                            <>
                                <PlusIcon className="size-4" />
                                <span>See all features</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Subscribe Button - Footer style like Clerk */}
                <div className="px-8 pb-8">
                    {isPremium ? (
                        <button
                            className="w-full py-3 px-4 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg font-semibold cursor-not-allowed"
                            disabled
                        >
                            <CheckIcon className="size-4 inline mr-2" />
                            Current Plan
                        </button>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-semibold transition-all hover:border-gray-400 active:scale-[0.98]"
                        >
                            Subscribe
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PricingTable;
