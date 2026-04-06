import { redirect } from "next/navigation";
import { LoginForm } from "@/app/(auth)/login/_components/LoginForm";
import { getSessionUser } from "@/lib/fetch/tokenStore";
import type { RouteSearchParams } from "@/types/api";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<RouteSearchParams>;
}) {
  const [resolvedSearchParams, user] = await Promise.all([
    searchParams,
    getSessionUser(),
  ]);

  const redirectTo = resolvedSearchParams.redirect || "/products";

  if (user) {
    redirect(redirectTo);
  }

  return (
    <div className="container-shell grid min-h-[calc(100vh-7rem)] items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-5">
        <p className="section-eyebrow">Authentication</p>
        <h1 className="display-copy text-6xl leading-none text-foreground">
          Sign in to save your picks and open the cart flow.
        </h1>
        <p className="max-w-2xl text-sm leading-8 text-muted">
          This login uses DummyJSON credentials, stores tokens in httpOnly
          cookies, and hands off all mutations to server actions.
        </p>
      </section>

      <section className="surface-ring rounded-[2.5rem] p-8">
        <p className="section-eyebrow">Sample credentials</p>
        <h2 className="display-copy mt-4 text-4xl text-foreground">
          Use the brief's test account
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          Username <strong className="text-foreground">emilys</strong>, password{" "}
          <strong className="text-foreground">emilyspass</strong>.
        </p>
        <div className="mt-8">
          <LoginForm redirectTo={redirectTo} />
        </div>
      </section>
    </div>
  );
}
