import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
});

// Automatically add the auth token if it exists in localStorage
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('bridge_user') || '{}');
    if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
