import API from "../api";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const chatService = {
    getAgentSessions: () => {
        return API.get(`${BASE_URL}/api/agent/sessions`);
    },

    closeChatSession: (session_id)=>{
        return API.post(`${BASE_URL}/api/agent/sessions/${session_id}/close`);
    },

    getClientConversation: (client_id) => {
        return API.get(`${BASE_URL}/api/agent/clients/${client_id}/messages`);
    }, 

    sendMessageToClient: ({clientId, message})=>{
        return API.post(`${BASE_URL}/api/agent/clients/${clientId}/send-message`, {text: message});    
    },

}