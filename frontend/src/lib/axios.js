import axios from "axios";

// Use env var or fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || "https://leet-iq.onrender.com/api";

console.log("[Axios] API URL:", API_URL);

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export default axiosInstance;
