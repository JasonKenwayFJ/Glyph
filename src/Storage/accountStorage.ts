import {create} from "zustand";
import {User} from "@blocknote/core";
import {invoke} from "@tauri-apps/api/core";

export type AccountStorage = {
    user: User | null;
    token: string | null;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    verifyUser: (token: string) => void;
};

export const useAccountStorage = create<AccountStorage>((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    verifyUser: async (token) :  Promise<boolean> => {
        return await invoke("verify_user", {token});
    },
}));