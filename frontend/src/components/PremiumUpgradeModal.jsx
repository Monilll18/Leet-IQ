import { Link } from "react-router-dom";
import { CrownIcon, ZapIcon, XIcon, InfinityIcon, SparklesIcon } from "lucide-react";

/**
 * Modal that prompts users to upgrade to premium
 */
function PremiumUpgradeModal({ isOpen, onClose, feature = "this feature", dailyRemaining = 0 }) {
    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box bg-gradient-to-br from-base-100 to-base-200 max-w-md relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10"
                >
                    <XIcon className="size-4" />
                </button>

                <div className="relative z-10 text-center py-4">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CrownIcon className="size-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black mb-2">
                        Unlock {feature}
                    </h3>

                    {/* Daily limit warning */}
                    {dailyRemaining === 0 && (
                        <div className="bg-warning/10 text-warning px-4 py-2 rounded-xl mb-4 text-sm font-medium">
                            You've reached your daily limit of 5 problems
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-base-content/70 mb-6">
                        Upgrade to Premium for unlimited access to all problems, hints, company tags, and more!
                    </p>

                    {/* Features */}
                    <div className="bg-base-200/50 rounded-2xl p-4 mb-6 text-left space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <InfinityIcon className="size-4 text-primary shrink-0" />
                            <span>Unlimited problems daily</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <SparklesIcon className="size-4 text-primary shrink-0" />
                            <span>Hints & video solutions</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <CrownIcon className="size-4 text-primary shrink-0" />
                            <span>Premium badge & more</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link
                        to="/premium"
                        className="btn btn-primary btn-lg w-full gap-2 shadow-lg"
                        onClick={onClose}
                    >
                        <ZapIcon className="size-5" />
                        Upgrade to Premium
                    </Link>

                    {/* Skip */}
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm mt-3 text-base-content/50"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/50" onClick={onClose}>
                <button>close</button>
            </form>
        </dialog>
    );
}

export default PremiumUpgradeModal;
