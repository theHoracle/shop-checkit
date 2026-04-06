"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/api/auth";
import { clearAuthSession, setAuthSession } from "@/lib/fetch/tokenStore";
import type { LoginActionState } from "@/types/auth";

export async function loginAction(
  _state: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const redirectTo = String(formData.get("redirect") ?? "/products");

  if (!username || !password) {
    return { error: "Enter both the username and password to continue." };
  }

  try {
    const session = await login({
      username,
      password,
      expiresInMins: 30,
    });

    await setAuthSession(session);
  } catch {
    return {
      error:
        "We couldn't sign you in with those details. Try the sample DummyJSON credentials from the brief.",
    };
  }

  redirect(redirectTo || "/products");
}

export async function logoutAction() {
  await clearAuthSession();
  redirect("/login");
}
