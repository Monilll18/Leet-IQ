import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { useAuth } from "@clerk/clerk-react";

/**
 * Hook to check user's premium status and features
 */
export function usePremium() {
    const { getToken, isSignedIn } = useAuth();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["premiumStatus"],
        queryFn: async () => {
            const token = await getToken();
            const response = await axiosInstance.get("/billing/status", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        enabled: isSignedIn,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        refetchOnWindowFocus: false
    });

    return {
        isPremium: data?.isPremium || false,
        plan: data?.plan || null,
        expiresAt: data?.expiresAt || null,
        dailyProblemsRemaining: data?.dailyProblemsRemaining ?? 5,
        dailySessionsRemaining: data?.dailySessionsRemaining ?? 3,
        features: data?.features || {
            unlimitedProblems: false,
            hints: false,
            companyTags: false,
            privateContests: false,
            detailedAnalytics: false,
            adFree: false,
            premiumBadge: false,
            submissionResults: false
        },
        isLoading,
        refetch
    };
}

/**
 * Check if user can solve more problems today (free tier limit)
 */
export function useCanSolveProblem() {
    const { isPremium, dailyProblemsRemaining } = usePremium();
    return isPremium || dailyProblemsRemaining > 0;
}
