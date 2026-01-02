import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { CheckCircle2Icon, Loader2Icon, CrownIcon } from "lucide-react";
import confetti from "canvas-confetti";

function SubscriptionSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { getToken } = useAuth();
    const [status, setStatus] = useState("activating"); // activating, success, error
    const [error, setError] = useState(null);

    useEffect(() => {
        const activatePremium = async () => {
            try {
                const token = await getToken();
                const plan = searchParams.get("plan") || "monthly";

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/billing/sync-premium`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ activate: true, plan }),
                    }
                );

                if (response.ok) {
                    setStatus("success");
                    // Trigger confetti
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                    });
                } else {
                    const data = await response.json();
                    setError(data.message || "Failed to activate premium");
                    setStatus("error");
                }
            } catch (err) {
                console.error("Error activating premium:", err);
                setError("Failed to connect to server");
                setStatus("error");
            }
        };

        activatePremium();
    }, [getToken, searchParams]);

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body text-center">
                        {status === "activating" && (
                            <>
                                <Loader2Icon className="size-16 text-primary mx-auto animate-spin" />
                                <h2 className="text-2xl font-bold mt-4">
                                    Activating Premium...
                                </h2>
                                <p className="text-base-content/70">
                                    Please wait while we set up your account
                                </p>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <div className="size-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mx-auto">
                                    <CrownIcon className="size-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold mt-4">
                                    Welcome to Premium! 🎉
                                </h2>
                                <p className="text-base-content/70">
                                    Your premium features are now active. Enjoy
                                    unlimited access!
                                </p>
                                <div className="space-y-2 mt-4">
                                    <p className="text-success flex items-center justify-center gap-2">
                                        <CheckCircle2Icon className="size-5" />
                                        Unlimited daily problems
                                    </p>
                                    <p className="text-success flex items-center justify-center gap-2">
                                        <CheckCircle2Icon className="size-5" />
                                        Company tags unlocked
                                    </p>
                                    <p className="text-success flex items-center justify-center gap-2">
                                        <CheckCircle2Icon className="size-5" />
                                        Advanced analytics
                                    </p>
                                </div>
                                <button
                                    className="btn btn-primary mt-6"
                                    onClick={() => navigate("/problems")}
                                >
                                    Start Practicing
                                </button>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <div className="size-16 rounded-full bg-error/20 flex items-center justify-center mx-auto">
                                    <span className="text-4xl">⚠️</span>
                                </div>
                                <h2 className="text-2xl font-bold mt-4 text-error">
                                    Activation Failed
                                </h2>
                                <p className="text-base-content/70">{error}</p>
                                <button
                                    className="btn btn-primary mt-6"
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionSuccessPage;
