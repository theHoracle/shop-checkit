import type { Metadata } from "next";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const speculationRules = JSON.stringify({
  prerender: [
    {
      where: { href_matches: "/products/*" },
      eagerness: "moderate",
    },
  ],
  prefetch: [
    {
      where: { href_matches: "/*" },
      eagerness: "conservative",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Shop Checkit",
    template: "%s | Shop Checkit",
  },
  description:
    "A fast editorial storefront built on DummyJSON with Next.js 16 cache components, streaming, and server actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>
          {children}
          <script type="speculationrules">{speculationRules}</script>
        </AppProviders>
      </body>
    </html>
  );
}
