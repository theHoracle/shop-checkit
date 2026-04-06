import { globalFetch } from "@/lib/fetch/globalFetch";
import type { AuthResponse, LoginPayload, SessionUser } from "@/types/auth";

export async function login(payload: LoginPayload) {
  return globalFetch<AuthResponse>("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: {
      ...payload,
      expiresInMins: payload.expiresInMins ?? 30,
    },
  });
}

export async function refreshSession(refreshToken: string) {
  return globalFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
    skipAuth: true,
    body: {
      refreshToken,
      expiresInMins: 30,
    },
  });
}

export async function getCurrentUser() {
  return globalFetch<SessionUser>("/auth/me");
}
