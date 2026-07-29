import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/auth.config"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"

const { auth } = NextAuth(authConfig)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

function handleCors(req: Request): NextResponse | null {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
  }
  return null
}

function withCors(res: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v))
  return res
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/")
}

/**
 * CORS + Seller-only protection:
 * - POST /api/listings
 * - POST /api/sellers/verify
 * - GET /api/sellers/me
 * - /seller/* pages
 *
 * Auth is either/or:
 * 1. Authorization: Bearer <mobile JWT> (jsonwebtoken-signed, AUTH_SECRET)
 * 2. NextAuth cookie session (web)
 *
 * 401 if unauthenticated / invalid token, 403 if authenticated but not SELLER.
 */
export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const method = req.method

  // Handle CORS preflight for all API routes
  if (isApiRoute(pathname)) {
    const corsResponse = handleCors(req)
    if (corsResponse) return corsResponse
  }

  const isSellerApiPost = pathname === "/api/listings" && method === "POST"
  const isSellerVerify = pathname === "/api/sellers/verify" && method === "POST"
  const isSellerMe = pathname === "/api/sellers/me" && method === "GET"
  const isSellerPage = pathname.startsWith("/seller")

  if (!isSellerApiPost && !isSellerVerify && !isSellerMe && !isSellerPage) {
    return isApiRoute(pathname)
      ? withCors(NextResponse.next())
      : NextResponse.next()
  }

  // --- Mobile Bearer JWT path ---
  const bearer = extractBearerToken(req.headers.get("authorization"))
  if (bearer) {
    const mobileUser = await verifyMobileToken(bearer)
    if (!mobileUser) {
      return withCors(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))
    }
    if (mobileUser.role !== "SELLER") {
      return withCors(NextResponse.json({ error: "Forbidden" }, { status: 403 }))
    }
    return withCors(NextResponse.next())
  }

  // --- Web NextAuth cookie session path (unchanged) ---
  const session = req.auth

  if (!session?.user) {
    return withCors(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))
  }

  if (session.user.role !== "SELLER") {
    return withCors(NextResponse.json({ error: "Forbidden" }, { status: 403 }))
  }

  return withCors(NextResponse.next())
})

export const config = {
  matcher: ["/api/:path*", "/seller/:path*"],
}
