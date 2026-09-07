import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serverErrorResponse } from "@/lib/api-error"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { signMobileToken } from "@/lib/sign-mobile-token"

export const dynamic = "force-dynamic"

/**
 * Re-signs the caller's mobile token against their CURRENT database role.
 *
 * The mobile JWT carries a `role` claim that is a snapshot from the moment it
 * was minted. When an admin approves a petition, the DB role flips BUYER →
 * SELLER but the stored token still says BUYER, so seller-gated routes would
 * 401. This endpoint heals that gap without a logout/login.
 *
 * Security rules:
 *  - The role is read from the DB for the authenticated user only. A role is
 *    NEVER accepted from the client, so a buyer cannot mint a SELLER/ADMIN
 *    token and an admin cannot escalate themselves.
 *  - The account must still exist and not be soft-deleted (same active-user
 *    check used everywhere else).
 */
export async function POST(request: Request) {
  try {
    const bearer = extractBearerToken(request.headers.get("authorization"))
    if (!bearer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyActiveMobileToken(bearer)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        universityId: true,
        deletedAt: true,
      },
    })

    if (!user || user.deletedAt) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = signMobileToken({ userId: user.id, role: user.role })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        universityId: user.universityId,
      },
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    return serverErrorResponse()
  }
}