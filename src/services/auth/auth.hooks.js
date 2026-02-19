import { useMutation } from "@tanstack/react-query"
import { authService } from "./auth.service"

export const useAgentLogin = () => {
    return useMutation({
        mutationFn: async (userData) => {
            try {
                const response = await authService.agentLogin(userData);
                return response;
            } catch (error) {
                throw error?.response?.data?.detail || error.message;
            }
        },
        onSuccess: (data) => {
            const { access_token, agent_id, email, role} = data?.data || {};
            if (access_token) {
                localStorage.setItem("auth_token", access_token);
                localStorage.setItem("agent_id", agent_id);
                localStorage.setItem("email", email);
                localStorage.setItem("role", role);
            }
        },
    });
};
export const useAdminLogin = () => {
    return useMutation({
        mutationFn: async (userData) => {
            try {
                const response = await authService.adminLogin(userData);
                return response;
            } catch (error) {
                throw error?.response?.data?.detail || error.message;
            }
        },
        onSuccess: (data) => {
            const { access_token, email, role} = data?.data || {};
            if (access_token) {
                localStorage.setItem("auth_token", access_token);
                localStorage.setItem("email", email);
                localStorage.setItem("role", role);
            }
        },
    });
};

