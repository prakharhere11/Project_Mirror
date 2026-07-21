import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Attach JWT to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired/invalid tokens globally
api.interceptors.response.use(
    (response) => response,
    (error) => {

        const status = error.response?.status;
        const url = error.config?.url || "";

        // Don't logout on failed login/register requests
        if (
            status === 401 &&
            !url.includes("/auth/login") &&
            !url.includes("/auth/register")
        ) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;