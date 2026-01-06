import axios from "axios";

// PRODUCTION URL - hardcoded to ensure /api is always included
const PROD_API_URL = "https://leet-iq.onrender.com/api";
const DEV_API_URL = "http://localhost:5000/api";

// Use production URL unless explicitly in development
const API_URL = import.meta.env.DEV ? DEV_API_URL : PROD_API_URL;

console.log("[Axios] API URL:", API_URL, "| Mode:", import.meta.env.DEV ? "DEV" : "PROD");

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export default axiosInstance;
