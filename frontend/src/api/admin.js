import axiosInstance from "../lib/axios";

/**
 * Get admin statistics
 */
export const getAdminStats = async () => {
    const response = await axiosInstance.get("/admin/stats");
    return response.data;
};

/**
 * Get all users with pagination and search
 */
export const getAllUsers = async (page = 1, limit = 20, search = '') => {
    const response = await axiosInstance.get("/admin/users", {
        params: { page, limit, search }
    });
    return response.data;
};

/**
 * Get all contests
 */
export const getAllContests = async () => {
    const response = await axiosInstance.get("/admin/contests");
    return response.data;
};

/**
 * Get all problems
 */
export const getAllProblems = async () => {
    const response = await axiosInstance.get("/admin/problems");
    return response.data;
};

/**
 * Create a new problem
 */
export const createProblem = async (problemData) => {
    const response = await axiosInstance.post("/admin/problems", problemData);
    return response.data;
};

/**
 * Update an existing problem
 */
export const updateProblem = async (id, problemData) => {
    const response = await axiosInstance.put(`/admin/problems/${id}`, problemData);
    return response.data;
};

/**
 * Delete a problem
 */
export const deleteProblem = async (id) => {
    const response = await axiosInstance.delete(`/admin/problems/${id}`);
    return response.data;
};

/**
 * Ban a user
 */
export const banUser = async (userId, reason) => {
    const response = await axiosInstance.post(`/admin/users/${userId}/ban`, { reason });
    return response.data;
};

/**
 * Unban a user
 */
export const unbanUser = async (userId) => {
    const response = await axiosInstance.post(`/admin/users/${userId}/unban`);
    return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
};

/**
 * Create a new contest
 */
export const createContest = async (contestData) => {
    const response = await axiosInstance.post("/admin/contests", contestData);
    return response.data;
};

/**
 * Update a contest
 */
export const updateContest = async (contestId, contestData) => {
    const response = await axiosInstance.put(`/admin/contests/${contestId}`, contestData);
    return response.data;
};

/**
 * Delete a contest
 */
export const deleteContest = async (contestId) => {
    const response = await axiosInstance.delete(`/admin/contests/${contestId}`);
    return response.data;
};

/**
 * Get all sessions
 */
export const getAllSessions = async () => {
    const response = await axiosInstance.get("/admin/sessions");
    return response.data;
};

/**
 * Delete/terminate a session
 */
export const deleteSession = async (sessionId) => {
    const response = await axiosInstance.delete(`/admin/sessions/${sessionId}`);
    return response.data;
};

