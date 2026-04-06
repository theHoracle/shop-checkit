import { cookies } from "next/headers";
import type { AuthResponse, SessionUser } from "@/types/auth";

const secureCookie = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: secureCookie,
  path: "/",
};

export async function getAccessToken() {
  return (await cookies()).get("accessToken")?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get("refreshToken")?.value;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const value = (await cookies()).get("sessionUser")?.value;

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as SessionUser;
  } catch {
    return null;
  }
}

export async function setAuthSession(session: AuthResponse) {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", session.accessToken, cookieOptions);
  cookieStore.set("refreshToken", session.refreshToken, cookieOptions);
  cookieStore.set(
    "sessionUser",
    JSON.stringify({
      id: session.id,
      username: session.username,
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
      image: session.image,
    }),
    cookieOptions,
  );
}

export async function trySetTokens(session: {
  accessToken: string;
  refreshToken?: string;
}) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", session.accessToken, cookieOptions);

    if (session.refreshToken) {
      cookieStore.set("refreshToken", session.refreshToken, cookieOptions);
    }
  } catch {
    return;
  }
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("sessionUser");
}
