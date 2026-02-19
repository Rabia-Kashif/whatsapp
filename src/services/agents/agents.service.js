import API from "../api";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const agentService = {
    getAgents: () => {
        return API.get(`${BASE_URL}/api/users`);
    },
    createAgent: (payload) => {
        return API.post(`${BASE_URL}/api/users`, payload);  
    },
    deleteAgent: (agentId) => {
        return API.delete(`${BASE_URL}/api/users/${agentId}`);
    },
    updateAgent: (agentId, payload) => {
        return API.put(`${BASE_URL}/api/users/${agentId}`, payload);
    }
}