import {User} from "../types/Entities.ts";
// import {create} from "zustand";

export interface AccountStorage{
    User: User;
}

// export const useAccountStorage = create<AccountStorage>((set) => ({
//     user: User,
//     setUser: (user) => set((state) => ({
//         user: user
//     })),
//     getUser: () => get({
//
//     })
// }));

