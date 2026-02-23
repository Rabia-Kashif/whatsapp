import { useMutation } from "@tanstack/react-query";
import { authService } from "./auth.service";

export const useAgentLogin = () => {
    return useMutation({
        mutationFn: async (userData) => {
            try {
                const response = await authService.agentLogin(userData);
                return response?.data;
            } catch (error) {
                if (error?.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }

                const message = error?.response?.data?.detail || error;
                throw new Error(message);
            }
        },
        onSuccess: async (data) => {
            const { access_token, agent_id, email, role } = data || {};
            if (access_token) {
                try {

                    localStorage.setItem("auth_token", access_token);
                    localStorage.setItem("agent_id", agent_id);
                    localStorage.setItem("email", email);
                    localStorage.setItem("role", role);
                } catch (error) {
                    console.error('Error storing user data: ', error);
                }
            }
        },
    });
};

export const useAdminLogin = () => {
    return useMutation({
        mutationFn: async (userData) => {
            try {
                const response = await authService.adminLogin(userData);
                return response?.data;
            } catch (error) {
                if (error?.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }

                const message = error?.response?.data?.detail || error;
                throw new Error(message);
            }
        },
        onSuccess: async (data) => {
            const { access_token, email, role } = data || {};
            if (access_token) {
                try {

                    localStorage.setItem("auth_token", access_token);
                    localStorage.setItem("email", email);
                    localStorage.setItem("role", role);
                } catch (error) {
                    console.error('Error storing user data: ', error);
                }

            }
        },
    });
};