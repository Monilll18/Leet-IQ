import React from 'react';
import { LockIcon, CrownIcon, SparklesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Premium Lock Overlay Component
 * Shows a lock overlay for premium-only features
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to lock (will be blurred)
 * @param {string} props.title - Title for the lock message
 * @param {string} props.description - Description of what premium unlocks
 * @param {boolean} props.isLocked - Whether to show the lock overlay
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 */
function PremiumLock({
    children,
    title = "Premium Feature",
    description = "Upgrade to Premium to unlock this feature",
    isLocked = true,
    size = 'md'
}) {
    if (!isLocked) {
        return children;
    }

    const sizeClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div className="relative h-full">
            {/* Blurred Content */}
            <div className="blur-sm pointer-events-none select-none opacity-50 h-full">
                {children}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-base-100/60 backdrop-blur-sm rounded-2xl">
                <div className={`text-center ${sizeClasses[size]} max-w-sm`}>
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                                <LockIcon className="size-8 text-primary" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                <CrownIcon className="size-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-sm text-base-content/60 mb-4">{description}</p>

                    <Link
                        to="/premium"
                        className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-primary/25 transition-all"
                    >
                        <SparklesIcon className="size-4" />
                        Upgrade to Premium
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PremiumLock;
