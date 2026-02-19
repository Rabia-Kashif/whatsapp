import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agentService } from "./agents.service";

export const useGetAgents = () => {
    return useQuery({
        queryKey: ['agents'],
        queryFn: async () => {
            try {
                const response = await agentService.getAgents();
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
export const useCreateAgent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            try {
                const response = await agentService.createAgent(payload);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries(['agents']);
        }
    })
}

export const useDeleteAgent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (agentId) => {
            try {
                const response = await agentService.deleteAgent(agentId);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries(['agents']);
        }

    })
}
export const useUpdateAgent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ agentId, payload }) => {
            try {
                const response = await agentService.updateAgent(agentId, payload);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries(['agents']);
        }
    })
}