"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { logoutAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/authStore";

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const SCROLL_DELTA_THRESHOLD = 6;
const TOP_REVEAL_THRESHOLD = 18;

const navLinkClassName =
  "flex min-h-11 items-center justify-center rounded-full px-4 py-3 text-sm font-medium text-foreground hover:bg-[color-mix(in_srgb,var(--surface-strong)_92%,white_8%)] md:min-h-10 md:px-4 md:py-2";

const loginLinkClassName =
  "inline-flex h-10 w-full items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold tracking-[0.01em] text-white shadow-[0_20px_40px_color-mix(in_srgb,var(--accent)_30%,transparent)] hover:bg-accent-strong md:w-auto";

export function ShopHeader() {
  const user = useAuthStore((state) => state.user);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [isMobileHidden, setIsMobileHidden] = useState(false);
  const [mobileHeaderHeight, setMobileHeaderHeight] = useState(0);

  const syncMobileHeaderHeight = useEffectEvent(() => {
    const nextHeight = headerRef.current?.offsetHeight ?? 0;

    setMobileHeaderHeight((currentHeight) =>
      currentHeight === nextHeight ? currentHeight : nextHeight,
    );
  });

  const updateMobileVisibility = useEffectEvent(() => {
    const nextScrollY = window.scrollY;
    const delta = nextScrollY - lastScrollYRef.current;

    if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD) {
      return;
    }

    if (nextScrollY <= TOP_REVEAL_THRESHOLD) {
      setIsMobileHidden(false);
      lastScrollYRef.current = nextScrollY;
      return;
    }

    setIsMobileHidden(delta > 0);
    lastScrollYRef.current = nextScrollY;
  });

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const headerElement = headerRef.current;
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            syncMobileHeaderHeight();
          });

    const handleMediaChange = () => {
      if (!mobileMediaQuery.matches) {
        setIsMobileHidden(false);
      }

      lastScrollYRef.current = window.scrollY;
      syncMobileHeaderHeight();
    };

    const handleScroll = () => {
      if (!mobileMediaQuery.matches || frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateMobileVisibility();
      });
    };

    lastScrollYRef.current = window.scrollY;
    syncMobileHeaderHeight();

    if (headerElement) {
      resizeObserver?.observe(headerElement);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", syncMobileHeaderHeight);
    mobileMediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", syncMobileHeaderHeight);
      mobileMediaQuery.removeEventListener("change", handleMediaChange);
      resizeObserver?.disconnect();

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [syncMobileHeaderHeight, updateMobileVisibility]);

  return (
    <>
      <div
        aria-hidden="true"
        className="md:hidden"
        style={{
          height:
            mobileHeaderHeight > 0 ? `${mobileHeaderHeight}px` : undefined,
        }}
      />
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-30 border-b border-line/60 bg-[color-mix(in_srgb,var(--background)_90%,white_10%)] backdrop-blur-xl transition-transform duration-300 ease-out will-change-transform md:sticky md:top-0 md:z-20 md:translate-y-0",
          isMobileHidden
            ? "pointer-events-none -translate-y-[calc(100%+0.75rem)]"
            : "pointer-events-auto translate-y-0",
        )}
      >
        <div className="container-shell py-3 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="flex items-start justify-between gap-3 md:items-center md:gap-6">
              <div className="min-w-0">
                <Link
                  href="/"
                  className="display-copy text-[clamp(2rem,7vw,2.4rem)] leading-none text-foreground"
                >
                  Shop Checkit
                </Link>
              </div>
              <span className="hidden text-xs uppercase tracking-[0.2em] text-muted md:inline-flex">
                E-Commerce Shop
              </span>
              {user ? (
                <span className="bg-[color-mix(in_srgb,var(--surface)_92%,white_8%)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:hidden">
                  {user.firstName}
                </span>
              ) : null}
            </div>

            <div className="flex flex-row gap-3 md:flex-row md:items-center md:gap-3">
              <nav className="flex-2 grid grid-cols-2 gap-2  text-sm md:flex md:flex-row md:flex-none md:flex-wrap md:items-center md:gap-2">
                <Link href="/products" className={navLinkClassName}>
                  Products
                </Link>
                <Link href="/cart" className={navLinkClassName}>
                  Cart
                </Link>
              </nav>
              <div className="flex-1">
              {user ? (
                <div className="flex items-center gap-2 md:gap-3">
                  <p className="hidden text-sm text-muted md:block">
                    Signed in as{" "}
                    <span className="font-semibold text-foreground">
                      {user.firstName}
                    </span>
                  </p>
                  <form action={logoutAction} className="w-full md:w-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="submit"
                      className="w-full md:w-auto"
                      >
                      Logout
                    </Button>
                  </form>
                </div>
              ) : (
                <Link href="/login" className={loginLinkClassName}>
                  Login
                </Link>
              )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
