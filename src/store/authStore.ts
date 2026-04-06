import { AuthUser } from "@/types/auth";
import { create } from "zustand";

type AuthStore = {
    user: AuthUser | null;
    setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  setUser: (user: AuthUser) => set({ user }),
}));