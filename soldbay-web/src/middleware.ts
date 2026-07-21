import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/auth.config"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"

const { auth } = NextAuth(authConfig)

/**
 * Seller-only protection:
 * - POST /api/listings
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
  const isSellerApiPost = pathname === "/api/listings" && method === "POST"
  const isSellerPage = pathname.startsWith("/seller")

  if (!isSellerApiPost && !isSellerPage) {
    return NextResponse.next()
  }

  // --- Mobile Bearer JWT path ---
  const bearer = extractBearerToken(req.headers.get("authorization"))
  if (bearer) {
    const mobileUser = await verifyMobileToken(bearer)
    if (!mobileUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (mobileUser.role !== "SELLER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.next()
  }

  // --- Web NextAuth cookie session path (unchanged) ---
  const session = req.auth

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "SELLER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/api/listings", "/seller/:path*"],
}
