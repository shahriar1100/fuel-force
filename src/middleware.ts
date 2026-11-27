import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login and logout API endpoints without authentication
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // Check token
  const tokenCookie = request.cookies.get("ff_admin_token");
  const isTokenValid = await verifyAdminToken(tokenCookie?.value);

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isTokenValid) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid cookies
      response.cookies.delete("ff_admin_token");
      response.cookies.delete("ff_admin_auth");
      return response;
    }
  }

  // Protect /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    if (!isTokenValid) {
      return NextResponse.json(
        { success: false, message: "অননুমোদিত প্রবেশাধিকার (Unauthorized: Invalid or expired session)" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
