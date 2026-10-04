import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/auth.config"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { getSubdomain } from "@/lib/subdomain"

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
export const proxy = auth(async (req) => {
  const { pathname } = req.nextUrl
  const method = req.method
  const host = req.headers.get("host") || ""

  const subdomain = getSubdomain(host)
  const isAdminSubdomain = subdomain === "admin"

  console.log(`[Proxy] ${method} ${pathname} | host: ${host} | subdomain: ${subdomain || 'root'}`)

  // 1. Root Domain Logic
  if (!isAdminSubdomain) {
    // SECURITY BLOCK: Prevent direct access to /admin paths on the main domain
    if (pathname.startsWith("/admin")) {
      console.log(`[Proxy] Blocking direct access to /admin on root domain. Returning dedicated 404.`)
      const url = req.nextUrl.clone()
      url.pathname = "/not-found-page"
      return NextResponse.rewrite(url)
    }
  }

  // 2. Admin Subdomain Logic: Map admin.soldbay.shop/foo -> /admin/foo
  if (isAdminSubdomain) {
    // Smart redirect for the root subdomain path
    if (pathname === "/") {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.host = host // preserve the user's requested host (e.g. admin.localhost:3000)
      if (req.auth?.user) {
        redirectUrl.pathname = "/waitlist"
      } else {
        redirectUrl.pathname = "/login"
      }
      console.log(`[Proxy] Redirecting admin root to ${redirectUrl.toString()}`)
      return NextResponse.redirect(redirectUrl)
    }

    // Prevent infinite rewrite loop if already prefixed
    if (pathname.startsWith("/admin")) {
      console.log(`[Proxy] Already rewritten to ${pathname}, continuing.`)
      // Allow it to proceed
    } else if (!pathname.startsWith("/api/auth")) {
      const rewriteUrl = req.nextUrl.clone()
      // Fix for Turbopack proxying local network IPs: force hostname to localhost in dev
      if (process.env.NODE_ENV === "development" && rewriteUrl.hostname.startsWith("192.168.")) {
        rewriteUrl.hostname = "localhost"
      }
      rewriteUrl.pathname = `/admin${pathname === "/" ? "" : pathname}`
      console.log(`[Proxy] Rewriting admin subdomain to ${rewriteUrl.toString()}`)
      return NextResponse.rewrite(rewriteUrl)
    }
  }

  // Handle CORS preflight for all API routes
  if (isApiRoute(pathname)) {
    const corsResponse = handleCors(req)
    if (corsResponse) return corsResponse
  }

  const isSellerApiPost = pathname === "/api/listings" && method === "POST"
  const isSellerApiDelete = /^\/api\/listings\/[^/]+$/.test(pathname) && method === "DELETE"
  const isSellerVerify = pathname === "/api/sellers/verify" && method === "POST"
  const isSellerMe = pathname === "/api/sellers/me" && method === "GET"
  const isSellerPage = pathname.startsWith("/seller")

  if (!isSellerApiPost && !isSellerApiDelete && !isSellerVerify && !isSellerMe && !isSellerPage) {
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png).*)"],
}
