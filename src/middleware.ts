import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Get the hostname from the request
  const isProd = process.env.NODE_ENV === "production";
  const prodDomain = "digital-payment-saas.vercel.app"; // Your Vercel domain

  // Skip for admin/platform domains
  if (hostname === "localhost:3000" || hostname === prodDomain) {
    return NextResponse.next();
  }

  // Extract tenant from subdomain
  let subdomain: string;

  if (isProd) {
    // Handle production subdomain (example: taverna.digital-payment-saas.vercel.app)
    subdomain = hostname.replace(`.${prodDomain}`, "");
  } else {
    // Handle local development (example: taverna.localhost:3000)
    subdomain = hostname.split(".")[0];
  }

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
