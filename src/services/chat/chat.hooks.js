import { useMutation, useQuery } from "@tanstack/react-query";
import { chatService } from "./chat.service"

export const useGetAgentSessions = () => {
    return useQuery({
        queryKey: ['agent-sessions'],
        queryFn: async () => {
            try {
                const response = await chatService.getAgentSessions();
                return response?.data;
            }
            catch (error) {
                if (error?.response) {
                    console.error('Response Status: ', error?.response?.status);
                    console.error('Response Data: ', error?.response?.data);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        retry: 2,
        retryDelay: 1000,
    })
}

export const useCloseChatSession = (session_id) => {
    return useMutation({
        mutationFn: async () => {
            try {
                const response = await chatService.closeChatSession(session_id);
                return response?.data;
            }
            catch (error) {
                if (error?.response) {
                    console.error('Response Status: ', error?.response?.status);
                    console.error('Response Data: ', error?.response?.data);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        retry: 2,
        retryDelay: 1000,
    })
}

export const useGetClientConversation = (client_id, options={}) => {
    return useQuery({
        queryKey: ['client-conversation'],
        queryFn: async () => {
            try {
                const response = await chatService.getClientConversation(client_id);
                return response?.data;
            }
            catch (error) {
                if (error?.response) {
                    console.error('Response Status: ', error?.response?.status);
                    console.error('Response Data: ', error?.response?.data);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        ...options,
        retry: 2,
        retryDelay: 1000,
    })
}