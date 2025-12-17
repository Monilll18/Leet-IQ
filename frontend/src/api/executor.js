import axiosInstance from "../lib/axios";

export const executeCode = async (language, code, problemId) => {
    try {
        const response = await axiosInstance.post("/execute", {
            language,
            code,
            problemId
        });

        // Backend returns: { status, output, expectedOutput, runtime, error }
        // Frontend expects: { success, output, error, runtime, memory }

        const data = response.data;

        if (data.status === "Runtime Error") {
            return {
                success: false,
                output: data.output || "",
                error: `Runtime Error:\n${data.output}`,
                runtime: data.runtime || 0,
            };
        }

        // If backend says success (even if Wrong Answer, purely code execution perspective)
        // Ideally backend should return strict success/fail field.
        // Based on our controller, we return 200 for both success and runtime error if handled.

        return {
            success: true,
            output: data.output,
            runtime: data.runtime || 0,
            memory: data.memory || 0,
        };

    } catch (error) {
        console.error("Execution API Error:", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Execution Failed",
        };
    }
};
