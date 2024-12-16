import { create } from "zustand";// 예시
import { CurrentLoggedInUser } from "../types/homeFeedType";

interface loggedInUserState {
    loggedInUser: CurrentLoggedInUser | null;
    setLoggedInUser: (user: CurrentLoggedInUser | null) => void;
}

interface LoginAlertStore {
    openLoginAlert: boolean;
    setOpenLoginAlert: (boolean: boolean) => void;
}

export const useLoggedInUserStore = create<loggedInUserState>((set) => ({
    loggedInUser: JSON.parse(localStorage.getItem('loggedInUser') || 'null'),
    setLoggedInUser: (user) => {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        set({ loggedInUser: user });
    },
}));

export const useLoginAlertStore = create<LoginAlertStore>((set) => ({
    openLoginAlert: true,
    setOpenLoginAlert: (boolean: boolean) => set({ openLoginAlert: boolean }),
}));