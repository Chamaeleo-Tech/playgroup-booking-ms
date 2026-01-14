import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
        if (typeof window !== 'undefined') {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Start refreshing
                    // We generate a new axios instance to avoid interceptor loops if refresh fails
                    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        token: refreshToken
                    });

                    const { token: newToken } = refreshResponse.data;

                    if (newToken) {
                        localStorage.setItem('token', newToken);

                        // Update default headers
                        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                        // Update original request
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    // Fall through to logout
                }
            }

            // Logout if refresh failed or no refresh token
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default api;
