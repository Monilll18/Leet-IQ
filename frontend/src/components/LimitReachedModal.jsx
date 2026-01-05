import { CrownIcon, LockIcon, XIcon } from "lucide-react";
import { Link } from "react-router-dom";

function LimitReachedModal({ isOpen, onClose, type = "problem", limit = 5 }) {
    if (!isOpen) return null;

    const config = {
        problem: {
            title: "Daily Problem Limit Reached",
            message: `You've solved ${limit} problems today. Free users can solve up to ${limit} problems per day.`,
            icon: "🧠"
        },
        session: {
            title: "Session Limit Exceeded",
            message: `You've created ${limit} sessions today. Free users can create up to ${limit} sessions per day.`,
            icon: "🎥"
        }
    };

    const { title, message, icon } = config[type] || config.problem;

    return (
        <div className="modal modal-open">
            <div className="modal-box relative bg-base-200 border border-warning/30 text-center max-w-md">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    <XIcon className="size-4" />
                </button>

                {/* Lock Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-warning/20 rounded-full p-4">
                        <LockIcon className="size-12 text-warning" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-2xl mb-2">{title}</h3>

                {/* Icon & Message */}
                <p className="text-base-content/70 mb-6">
                    {icon} {message}
                </p>

                {/* Benefits list */}
                <div className="bg-base-300 rounded-xl p-4 mb-6 text-left">
                    <p className="font-bold text-sm mb-2 flex items-center gap-2">
                        <CrownIcon className="size-4 text-warning" />
                        Upgrade to Premium for:
                    </p>
                    <ul className="text-sm text-base-content/70 space-y-1 ml-6">
                        <li>✓ Unlimited problems per day</li>
                        <li>✓ Unlimited sessions per day</li>
                        <li>✓ Company tags & hints</li>
                        <li>✓ Premium-only problems</li>
                        <li>✓ Detailed analytics</li>
                    </ul>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 justify-center">
                    <button onClick={onClose} className="btn btn-ghost">
                        Maybe Later
                    </button>
                    <Link to="/premium" className="btn btn-warning gap-2">
                        <CrownIcon className="size-4" />
                        Upgrade to Premium
                    </Link>
                </div>
            </div>
            <div className="modal-backdrop bg-black/50" onClick={onClose} />
        </div>
    );
}

export default LimitReachedModal;
