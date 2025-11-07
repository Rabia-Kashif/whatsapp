import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
    persist(
        (set) => ({
            clientId: null,
            setClientId: (id) => set({ clientId: id }),
        })
    )
)