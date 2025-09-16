import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Protect /admin using the NextAuth JWT.
 * Only the email in ADMIN_EMAIL is allowed.
 */
export async function middleware(req: NextRequest) {
  // Only guard /admin; everything else passes through
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();

  // Read the NextAuth session token (requires NEXTAUTH_SECRET)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const sessionEmail = (token?.email || "").toLowerCase();

  // If not logged in or not the allowed admin email → send to GitHub sign-in
  if (!token || !sessionEmail || !adminEmail || sessionEmail !== adminEmail) {
    const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    // bounce back to the original /admin page after sign-in
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Only run middleware for /admin
export const config = { matcher: ["/admin/:path*"] };
