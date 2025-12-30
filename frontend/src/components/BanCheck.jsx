import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

/**
 * Component to check if user is banned and show modal with appeal option
 */
function BanCheck({ children }) {
    const { isSignedIn } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const [showAppealForm, setShowAppealForm] = useState(false);
    const [appealMessage, setAppealMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [banDetails, setBanDetails] = useState(null);

    const handleSubmitAppeal = async () => {
        if (!appealMessage.trim()) {
            toast.error("Please enter your appeal message");
            return;
        }

        setSubmitting(true);
        try {
            await axiosInstance.post("/appeals/submit", { message: appealMessage });
            toast.success("Appeal submitted successfully! An admin will review it soon.");
            setShowAppealForm(false);
            setAppealMessage("");
            await signOut();
            navigate("/");
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error("You already have a pending appeal");
            } else {
                toast.error(error.response?.data?.message || "Failed to submit appeal");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    useEffect(() => {
        if (!isSignedIn) return;

        // Add response interceptor to check for ban status
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 403 && error.response?.data?.banned) {
                    // User is banned
                    const { reason, bannedAt } = error.response.data;
                    setBanDetails({ reason, bannedAt });

                    return Promise.reject(error);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [isSignedIn]);

    if (!banDetails) {
        return children;
    }

    return (
        <>
            {children}

            {/* Ban Modal */}
            <div className="modal modal-open">
                <div className="modal-box max-w-md bg-error text-error-content">
                    <h3 className="font-bold text-2xl mb-4">⛔ Account Banned</h3>
                    <p className="mb-4">Your account has been banned from this platform.</p>

                    <div className="bg-base-100 text-base-content p-4 rounded-lg mb-4">
                        <p className="font-semibold">Reason:</p>
                        <p className="text-sm">{banDetails.reason || "No reason provided"}</p>
                        <p className="text-xs text-base-content/60 mt-2">
                            Banned on: {new Date(banDetails.bannedAt).toLocaleString()}
                        </p>
                    </div>

                    {!showAppealForm ? (
                        <>
                            <p className="text-sm mb-4">
                                If you believe this is a mistake, you can submit an appeal.
                            </p>
                            <div className="modal-action">
                                <button className="btn btn-ghost" onClick={handleSignOut}>
                                    Sign Out
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowAppealForm(true)}
                                >
                                    Submit Appeal
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text text-error-content">
                                        Explain why you should be unbanned:
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered bg-base-100 text-base-content h-32"
                                    placeholder="Enter your plea or explain the mistake..."
                                    value={appealMessage}
                                    onChange={(e) => setAppealMessage(e.target.value)}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="alert alert-info text-info-content">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-sm">An admin will review your appeal and respond.</span>
                            </div>

                            <div className="modal-action">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setShowAppealForm(false)}
                                    disabled={submitting}
                                >
                                    Back
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmitAppeal}
                                    disabled={submitting || !appealMessage.trim()}
                                >
                                    {submitting ? "Submitting..." : "Submit Appeal"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default BanCheck;
