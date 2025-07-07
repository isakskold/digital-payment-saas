import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const hostname = request.headers.get("host") || "";

  // För demo-syften: hårdkoda folkets hus som standard-tenant
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-subdomain", "folketshus");

  // Keep the multi-tenant logic commented but ready for later
  /*
  // Extract tenant from subdomain or custom domain
  const subdomain = hostname.split(".")[0];
  requestHeaders.set("x-tenant-subdomain", subdomain);
  */

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
