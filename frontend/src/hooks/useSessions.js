import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Mock data for development
const mockActiveSessions = [
    {
        id: '1',
        problem: 'Two Sum',
        difficulty: 'Easy',
        participants: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    },
    {
        id: '2',
        problem: 'Valid Parentheses',
        difficulty: 'Easy',
        participants: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    },
];

const mockRecentSessions = [
    {
        id: '1',
        problem: 'Two Sum',
        difficulty: 'Easy',
        status: 'Completed',
        duration: '45 min',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
        id: '2',
        problem: 'Reverse String',
        difficulty: 'Easy',
        status: 'Completed',
        duration: '30 min',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
];

// Hook to get active sessions
export const useActiveSessions = () => {
    return useQuery({
        queryKey: ['activeSessions'],
        queryFn: async () => {
            // TODO: Replace with actual API call
            // const { data } = await axios.get(`${API_URL}/sessions/active`);
            // return data;
            return mockActiveSessions;
        },
    });
};

// Hook to get user's recent sessions
export const useMyRecentSessions = () => {
    return useQuery({
        queryKey: ['myRecentSessions'],
        queryFn: async () => {
            // TODO: Replace with actual API call
            // const { data } = await axios.get(`${API_URL}/sessions/my-recent`);
            // return data;
            return mockRecentSessions;
        },
    });
};

// Hook to get session by ID
export const useSessionById = (sessionId) => {
    return useQuery({
        queryKey: ['session', sessionId],
        queryFn: async () => {
            // TODO: Replace with actual API call
            // const { data } = await axios.get(`${API_URL}/sessions/${sessionId}`);
            // return data;
            return {
                id: sessionId,
                problem: 'Two Sum',
                difficulty: 'Easy',
                participants: ['user1', 'user2'],
                createdAt: new Date(),
                code: '',
            };
        },
        enabled: !!sessionId,
    });
};

// Hook to create a new session
export const useCreateSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sessionData) => {
            // TODO: Replace with actual API call
            // const { data } = await axios.post(`${API_URL}/sessions`, sessionData);
            // return data;
            return {
                id: Math.random().toString(36).substr(2, 9),
                ...sessionData,
                createdAt: new Date(),
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
            queryClient.invalidateQueries({ queryKey: ['myRecentSessions'] });
        },
    });
};

// Hook to join a session
export const useJoinSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sessionId) => {
            // TODO: Replace with actual API call
            // const { data } = await axios.post(`${API_URL}/sessions/${sessionId}/join`);
            // return data;
            return { success: true, sessionId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
        },
    });
};

// Hook to end a session
export const useEndSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sessionId) => {
            // TODO: Replace with actual API call
            // const { data } = await axios.post(`${API_URL}/sessions/${sessionId}/end`);
            // return data;
            return { success: true, sessionId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
            queryClient.invalidateQueries({ queryKey: ['myRecentSessions'] });
        },
    });
};
