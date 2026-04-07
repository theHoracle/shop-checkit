import { create } from "zustand";
import type { AuthUser } from "@/types/auth";

type AuthStore = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  setUser: (user: AuthUser) => set({ user }),
}));
