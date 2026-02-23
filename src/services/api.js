import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 3000,
})

// Request Interceptor to set token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// Response Inteceptor to handle token expiry
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            setTimeout(() => {
                window.location.href = "/";
            }, 5000);

            return Promise.reject(
                error.response?.data?.detail ||
                { message: "Unauthorized! Redirecting to login..." }
            );
        }

        // IMPORTANT — always reject other errors
        return Promise.reject(error);
    }
);
export default API;