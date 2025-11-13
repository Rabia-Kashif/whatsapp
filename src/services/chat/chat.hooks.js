import { useMutation, useQuery } from "@tanstack/react-query";
import { chatService } from "./chat.service"
import { queryClient } from "../../providers/queryClient";

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

export const useCloseChatSession = () => {
    return useMutation({
        mutationFn: async (session_id) => {
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
        onSuccess: () => {
            queryClient.invalidateQueries(['agent-sessions'])
        },
        retry: 2,
        retryDelay: 1000,
    })
}

export const useGetClientConversation = (client_id, options = {}) => {
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
        enabled: !!client_id,
        retry: 2,
        retryDelay: 1000,
    })
}

export const useSendMessageToClient = () => {
    return useMutation({
        mutationFn: async (clientId, message) => {
            try {
                const response = await chatService.sendMessageToClient(clientId, message);
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
