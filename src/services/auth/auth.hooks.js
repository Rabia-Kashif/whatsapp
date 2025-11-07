import { useMutation } from "@tanstack/react-query"
import { authService } from "./auth.service"

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data) => {
            try {
                const response = await authService.login(data);
                return response?.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error?.response?.status);
                    console.error('Response Data: ', error?.response?.data);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        onSuccess: async (data) => {
            const token = data?.access_token;
            const username = data?.username;
            const agentId = data?.agent_id;
            if (token) {
                try {
                    localStorage.setItem('auth_token', token);
                    localStorage.setItem('agent_id', agentId);
                    localStorage.setItem('username', username);
                } catch (error) {
                    console.error('Error storing user data: ', error);
                }
            }
        }
    })
}