import axiosInstance from "../lib/axios";

export const executeCode = async (language, code, problemId, isSubmit = false) => {
    try {
        const response = await axiosInstance.post("/execute", {
            language,
            code,
            problemId,
            isSubmit
        });

        const data = response.data;

        // Return the full payload so the UI can access rawOutput, cases, etc.
        return {
            success: data.status === "Accepted",
            ...data
        };

    } catch (error) {
        console.error("Execution API Error:", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Execution Failed",
        };
    }
};
