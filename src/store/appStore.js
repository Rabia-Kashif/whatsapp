import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
    persist(
        (set) => ({
            clientId: null,
            setClientId: (id) => set({ clientId: id }),

            sessionStatus: "",
            setSessionStatus: (status) => set({ sessionStatus: status }),

            websocketClientMessage: null,
            setWebsocketClientMessage: (message) => set({ websocketClientMessage: message }),

            websocketNotification: null,
            setWebsocketNotification: (notification) => set({ websocketNotification: notification }),
        })
    ),
    {
        name: "whatsapp-store", //app store name for local storage
        partialize: (state) => ({
            clientId: state.clientId, //only these will be persisted
            sessionStatus: state.sessionStatus,
        })
    }
)