"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function SubmitButton() {
  const { pending } = useFormStatus();

  return <Button type="submit">{pending ? "Signing in..." : "Sign in"}</Button>;
}

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <input name="redirect" type="hidden" value={redirectTo} />
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="username"
        >
          Username
        </label>
        <Input
          id="username"
          name="username"
          defaultValue="emilys"
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          defaultValue="emilyspass"
          autoComplete="current-password"
        />
      </div>
      {state.error ? (
        <p className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--accent)_40%,white_60%)] bg-[color:color-mix(in_srgb,var(--accent)_10%,white_90%)] px-4 py-3 text-sm text-accent-strong">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
