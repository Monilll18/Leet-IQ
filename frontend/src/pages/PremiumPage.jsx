import { useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import PricingTable from "../components/PricingTable";
import { usePremium } from "../hooks/usePremium";
import axiosInstance from "../lib/axios";
import {
    CheckIcon,
    XIcon,
    ZapIcon,
    CrownIcon,
    SparklesIcon,
    RocketIcon,
    ShieldCheckIcon,
    BarChart3Icon,
    InfinityIcon,
    BuildingIcon,
    TrophyIcon,
    MessageCircleQuestionIcon
} from "lucide-react";

const FEATURES = [
    {
        name: "Daily Problem Limit",
        free: "5 problems/day",
        premium: "Unlimited",
        icon: InfinityIcon
    },
    {
        name: "Problem Hints",
        free: false,
        premium: "3 hints per problem",
        icon: MessageCircleQuestionIcon
    },
    {
        name: "Video Solutions",
        free: false,
        premium: true,
        icon: RocketIcon
    },
    {
        name: "Company Tags",
        free: false,
        premium: "Google, Meta, Amazon...",
        icon: BuildingIcon
    },
    {
        name: "Analytics Dashboard",
        free: "Basic",
        premium: "Detailed insights",
        icon: BarChart3Icon
    },
    {
        name: "Private Contests",
        free: false,
        premium: "Unlimited",
        icon: TrophyIcon
    },
    {
        name: "Ad-Free Experience",
        free: false,
        premium: true,
        icon: ShieldCheckIcon
    },
    {
        name: "Premium Badge",
        free: false,
        premium: true,
        icon: CrownIcon
    }
];

const FAQ = [
    {
        q: "Can I cancel anytime?",
        a: "Yes! You can cancel your subscription at any time. You'll continue to have premium access until the end of your billing period."
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, debit cards, and digital wallets through our secure payment processor."
    },
    {
        q: "Is there a free trial?",
        a: "We offer a 7-day free trial for new premium subscribers. No credit card required to start."
    },
    {
        q: "What happens to my progress if I cancel?",
        a: "Your progress, solved problems, and submissions are never deleted. You'll just have limited access to premium features."
    }
];

function PremiumPage() {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const { isPremium, plan, refetch, hasClerkSubscription } = usePremium();
    const { getToken } = useAuth();
    const [activating, setActivating] = useState(false);

    // Manual activation - Only works if backend validates subscription
    const handleActivatePremium = async () => {
        try {
            setActivating(true);
            const token = await getToken();
            const response = await axiosInstance.post(
                "/billing/sync-premium",
                { activate: true, plan: "monthly" }, // Backend validates plan from metadata anyway
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                await refetch();
                window.location.reload();
            } else {
                alert("Activation failed: " + (response.data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Activation error:", err);
            alert("Error: " + (err.response?.data?.message || "Sync failed. Please contact support."));
        } finally {
            setActivating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <SparklesIcon className="size-4 text-primary" />
                        <span className="text-sm font-bold text-primary">LEVEL UP YOUR CODING</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Unlock Your Full Potential
                    </h1>

                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
                        Get unlimited access to all problems, hints, company tags, and exclusive features to ace your coding interviews.
                    </p>

                    {isPremium && (
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-success/20 rounded-full mb-8">
                            <CrownIcon className="size-5 text-success" />
                            <span className="font-bold text-success">You're a Premium Member ({plan})</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Pricing Table Component */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <PricingTable />



                {/* Manual Activation Button - Unconditional for Revert */}
                {!isPremium && (
                    <div className="mt-8 p-6 bg-base-100 rounded-xl border border-warning/20 text-center">
                        <div className="flex items-center justify-center gap-2 text-warning mb-2">
                            <SparklesIcon className="size-5" />
                            <span className="font-bold">Premium Features</span>
                        </div>
                        <p className="text-sm text-base-content/60 mb-4">
                            Activate premium instantly (Dev Mode/Vulnerable)
                        </p>
                        <button
                            onClick={handleActivatePremium}
                            disabled={activating}
                            className="btn btn-warning btn-lg gap-2 shadow-lg"
                        >
                            {activating ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Activating...
                                </>
                            ) : (
                                <>
                                    <ZapIcon className="size-5" />
                                    Activate Premium Now
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Features Grid */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-16">
                    <h2 className="text-3xl font-black text-center mb-8">Premium Features</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURES.slice(0, 6).map((feature, idx) => (
                            <div key={idx} className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="card-body">
                                    <feature.icon className="size-10 text-primary mb-4" />
                                    <h3 className="font-bold text-lg mb-2">{feature.name}</h3>
                                    <p className="text-base-content/60 text-sm">
                                        {typeof feature.premium === "string" ? feature.premium : "Included with Premium"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {FAQ.map((item, idx) => (
                            <div
                                key={idx}
                                className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-2xl"
                            >
                                <input
                                    type="radio"
                                    name="faq-accordion"
                                    checked={expandedFaq === idx}
                                    onChange={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                />
                                <div className="collapse-title text-lg font-bold">
                                    {item.q}
                                </div>
                                <div className="collapse-content">
                                    <p className="text-base-content/70">{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                {!isPremium && (
                    <div className="mt-16 text-center">
                        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content max-w-2xl mx-auto">
                            <div className="card-body items-center text-center py-12">
                                <RocketIcon className="size-12 mb-4" />
                                <h3 className="text-3xl font-black mb-2">Ready to Level Up?</h3>
                                <p className="text-primary-content/80 mb-6">
                                    Join thousands of developers who are acing their interviews with LeetIQ Premium.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PremiumPage;
