import { useProfile } from "./useAuth";

/**
 * Hook to check if current user is an admin
 */
export const useAdmin = () => {
    const { data: profile, isLoading } = useProfile();

    return {
        isAdmin: profile?.isAdmin || false,
        role: profile?.role || 'user',
        isLoading,
    };
};
