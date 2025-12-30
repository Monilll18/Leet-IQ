import axiosInstance from "../lib/axios";

/**
 * Get all problems from backend
 */
export const getAllProblemsPublic = async () => {
    const response = await axiosInstance.get("/problems");
    return response.data;
};
