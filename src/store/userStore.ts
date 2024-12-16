import { create, StateCreator } from "zustand";
// 예시
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

// User 타입은 실제 유저 정보 타입으로 교체.
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  about_me: string;
  profile_picture: string;
  follow: any[];
  created_at: Date;
  modified_at: Date;
  influencer?: {
    id: number;
    follower: string;
    banner_picture: string;
    category: string;
  };
}

const createUserStore: StateCreator<UserState> = (set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
});

// Zustand 스토어 생성
export const useUserStore = create<UserState>(createUserStore);
