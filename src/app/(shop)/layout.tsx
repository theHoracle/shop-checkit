import { Suspense } from "react";
import { CartDrawerActivity } from "@/components/CartDrawerActivity";
import { ShopHeader } from "@/components/ShopHeader";
import { getSessionUser } from "@/lib/fetch/tokenStore";
import { AuthProvider } from "@/providers/AuthProvider";

async function AuthWrapper({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return <AuthProvider user={user}>{children}</AuthProvider>;
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div />}>
      <AuthWrapper>
        <div className="min-h-screen">
          <ShopHeader />
          <main className="page-reveal pb-16">{children}</main>
          <footer className="container-shell border-t border-line/80 py-8 text-sm text-muted">
            Shop Checkit pairs Next.js 16 cache components with a warm editorial
            storefront system built for the DummyJSON assessment.
          </footer>
          <CartDrawerActivity />
        </div>
      </AuthWrapper>
    </Suspense>
  );
}
