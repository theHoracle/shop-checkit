"use client";

import { createContext, useContext } from "react";
import type { SessionUser } from "@/types/auth";

const AuthContext = createContext<SessionUser | null>(null);

export function AuthSessionProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser | null;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
