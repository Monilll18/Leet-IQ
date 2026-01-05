import { CrownIcon, LockIcon } from "lucide-react";
import { Link } from "react-router-dom";

function PremiumLockOverlay({ show, problemTitle }) {
    if (!show) return null;

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-300/95 backdrop-blur-sm rounded-xl">
            <div className="text-center max-w-sm p-6">
                {/* Lock Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-warning/20 rounded-full p-4">
                        <LockIcon className="size-16 text-warning" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-2">Subscribe to unlock</h2>

                {/* Message */}
                <p className="text-base-content/70 mb-6">
                    Thanks for using LeetIQ! To view this question you must subscribe to premium.
                </p>

                {/* Upgrade button */}
                <Link to="/premium" className="btn btn-warning gap-2">
                    <CrownIcon className="size-4" />
                    Subscribe
                </Link>
            </div>
        </div>
    );
}

export default PremiumLockOverlay;
