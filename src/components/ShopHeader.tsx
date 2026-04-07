"use client";

import Link from "next/link";
import { logoutAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";

export function ShopHeader() {
  const user = useAuthStore((state) => state.user);
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-[color-mix(in_srgb,var(--background)_88%,white_12%)] backdrop-blur-md">
      <div className="container-shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="display-copy text-3xl text-foreground">
            Shop Checkit
          </Link>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted md:inline-flex">
            E-Commerce Shop
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/products"
            className="rounded-full px-4 py-2 hover:bg-surface-strong"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="rounded-full px-4 py-2 hover:bg-surface-strong"
          >
            Cart
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted">
                Signed in as{" "}
                <span className="font-semibold text-foreground">
                  {user.firstName}
                </span>
              </p>
              <form action={logoutAction}>
                <Button variant="secondary" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
