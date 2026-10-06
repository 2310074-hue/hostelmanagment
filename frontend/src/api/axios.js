import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

// Base URL is read from the environment variable so it is never hardcoded.
// See .env -> REACT_APP_API_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ----- Request Interceptor -----
// Automatically attaches the auth token (if present) to every outgoing request.
// This is how the Django backend will know which user is making the request
// (Django REST Framework Token/JWT auth expects an "Authorization" header).
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // If using DRF TokenAuthentication instead of JWT, use this format instead:
            // config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ----- Response Interceptor -----
// Centralised handling of expired/invalid sessions.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid -> force logout
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.ROLE);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;