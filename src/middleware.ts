import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Skip for main domain (your platform domain)
  if (hostname === "localhost:3000" || hostname === "yourplatform.com") {
    return NextResponse.next();
  }

  // Extract tenant from subdomain or custom domain
  const subdomain = hostname.split(".")[0];

  // Add tenant info to headers for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-subdomain", subdomain);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
