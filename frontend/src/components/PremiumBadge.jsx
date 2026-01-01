import { CrownIcon } from "lucide-react";

/**
 * Premium badge to display on user profiles and cards
 */
function PremiumBadge({ size = "sm", showText = true, className = "" }) {
    const sizeClasses = {
        xs: "text-[10px] px-1.5 py-0.5 gap-0.5",
        sm: "text-xs px-2 py-1 gap-1",
        md: "text-sm px-3 py-1.5 gap-1.5",
        lg: "text-base px-4 py-2 gap-2"
    };

    const iconSizes = {
        xs: "size-2.5",
        sm: "size-3",
        md: "size-4",
        lg: "size-5"
    };

    return (
        <div
            className={`inline-flex items-center ${sizeClasses[size]} bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold shadow-sm ${className}`}
        >
            <CrownIcon className={iconSizes[size]} />
            {showText && <span>PRO</span>}
        </div>
    );
}

export default PremiumBadge;
