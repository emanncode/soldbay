import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serverErrorResponse } from "@/lib/api-error"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { signMobileToken } from "@/lib/sign-mobile-token"
import { auth } from "@/auth"

const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._]*$/u
const MAX_USERNAME_LENGTH = 30
const MAX_BUSINESS_NAME_LENGTH = 60
const MAX_BIO_LENGTH = 500

/**
 * Converts an existing BUYER into a campus seller WITHOUT re-running signup.
 *
 * The user is already authenticated (email, password, university are intact),
 * so this only creates their SellerProfile and flips role to SELLER in a
 * single transaction. Because the mobile JWT carries a `role` claim and is a
 * snapshot from login, a fresh token signed with role=SELLER is returned so
 * seller-gated API routes keep working without forcing a re-login.
 */
export async function POST(request: Request) {
  try {
    const bearer = extractBearerToken(request.headers.get("authorization"))
    let userId: string | null = null

    if (bearer) {
      const mobileUser = await verifyActiveMobileToken(bearer)
      if (!mobileUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = mobileUser.userId
    } else {
      const session = await auth()
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = session.user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const usernameRaw = typeof body.username === "string" ? body.username.trim() : ""
    const businessName =
      typeof body.businessName === "string" && body.businessName.trim()
        ? body.businessName.trim().slice(0, MAX_BUSINESS_NAME_LENGTH)
        : null
    const bio =
      typeof body.bio === "string" && body.bio.trim()
        ? body.bio.trim().slice(0, MAX_BIO_LENGTH)
        : null

    if (!usernameRaw) {
      return NextResponse.json(
        { error: "Please choose a username for your store." },
        { status: 400 },
      )
    }

    const username = usernameRaw.toLowerCase()
    if (
      username.length > MAX_USERNAME_LENGTH ||
      !USERNAME_PATTERN.test(username)
    ) {
      return NextResponse.json(
        {
          error:
            "Usernames can only contain lowercase letters, numbers, dots, and underscores.",
        },
        { status: 400 },
      )
    }

    const created = await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            deletedAt: true,
          },
        })

        if (!user || user.deletedAt) {
          return { status: 401 as const, error: "Unauthorized" as const }
        }

        if (user.role === "SELLER") {
          return {
            status: 409 as const,
            error: "You're already a campus seller." as const,
          }
        }

        const existing = await tx.sellerProfile.findUnique({ where: { username } })
        if (existing) {
          return {
            status: 409 as const,
            error: "That username is already taken. Please choose another." as const,
          }
        }

        const sellerProfile = await tx.sellerProfile.create({
          data: {
            userId: user.id,
            username,
            businessName,
            bio,
          },
          select: { id: true, verificationStatus: true },
        })

        const updated = await tx.user.update({
          where: { id: user.id },
          data: { role: "SELLER" },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            universityId: true,
          },
        })

        return { status: 201 as const, user: updated, sellerProfile }
      },
      { timeout: 30000, maxWait: 45000 },
    )

    if (created.status !== 201) {
      return NextResponse.json(
        { error: created.error },
        { status: created.status },
      )
    }

    // Re-sign the mobile token so the existing session adopts the SELLER role
    // without forcing the user to log out and back in.
    const token = signMobileToken({ userId: created.user.id, role: "SELLER" })

    return NextResponse.json({
      token,
      user: {
        id: created.user.id,
        email: created.user.email,
        name: created.user.name,
        role: created.user.role,
        universityId: created.user.universityId,
      },
      sellerProfileId: created.sellerProfile.id,
      verificationStatus: created.sellerProfile.verificationStatus,
    })
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "That username is already taken. Please choose another." },
        { status: 409 },
      )
    }

    console.error("Seller upgrade error:", error)
    return serverErrorResponse()
  }
}