import API from '../api';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authService = {
    login: (payload) => {
        return API.post(`${BASE_URL}/api/agent/login`, payload);
    }
}