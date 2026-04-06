"use client";

import { useAuthStore } from "@/store/authStore";
import { AuthUser } from "@/types/auth";
import { useEffect, useRef } from "react";

export const AuthProvider = ({ children, user }: { children: React.ReactNode; user: AuthUser | null }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const prevUserRef = useRef<AuthUser | null>(null);

  useEffect(() => {
    if (user && user !== prevUserRef.current) {
      try {
        setUser(user);
        prevUserRef.current = user;
      } catch (error) {
        console.error("Error setting user:", error);
      }
    }
  }, [user, setUser]);

  return <div>{children}</div>;
};
