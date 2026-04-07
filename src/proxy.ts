import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has("accessToken");

  if (!hasToken && request.nextUrl.pathname.startsWith("/account")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", "/account");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
