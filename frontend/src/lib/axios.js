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

// Store the getToken function from Clerk
let getTokenFn = null;

// Function to set the getToken function (called from App.jsx or auth provider)
export const setAuthTokenGetter = (fn) => {
    getTokenFn = fn;
};

// Request interceptor to automatically attach Clerk token
axiosInstance.interceptors.request.use(
    async (config) => {
        if (getTokenFn) {
            try {
                const token = await getTokenFn();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.warn("[Axios] Failed to get auth token:", error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
