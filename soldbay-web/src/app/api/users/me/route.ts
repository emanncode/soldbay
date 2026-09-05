import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serverErrorResponse } from "@/lib/api-error"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth"
import { computeRetainUntil } from "@/lib/account-retention"

export const dynamic = "force-dynamic"

async function authenticate(request: Request): Promise<string | null> {
  const bearer = extractBearerToken(request.headers.get("authorization"))

  if (bearer) {
    const mobileUser = await verifyActiveMobileToken(bearer)
    return mobileUser?.userId ?? null
  }

  const session = await auth()
  return session?.user?.id ?? null
}

export async function GET(request: Request) {
  try {
    const userId = await authenticate(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Get user me error:", error)
    return serverErrorResponse()
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await authenticate(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const data: { universityId?: string } = {}

    if (body.universityId !== undefined) {
      if (typeof body.universityId !== "string") {
        return NextResponse.json(
          { error: "universityId must be a string." },
          { status: 400 },
        )
      }
      // Fetch the current user to check if university is already set
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { universityId: true },
      })
      if (currentUser?.universityId) {
        return NextResponse.json(
          { error: "University cannot be changed after signup. Please contact support if you need to update this." },
          { status: 400 },
        )
      }
      const university = await prisma.university.findUnique({
        where: { id: body.universityId },
      })
      if (!university) {
        return NextResponse.json(
          { error: "University not found." },
          { status: 404 },
        )
      }
      data.universityId = body.universityId
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update." },
        { status: 400 },
      )
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        universityId: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }
    console.error("Update user me error:", error)
    return serverErrorResponse()
  }
}

/**
 * Soft-deletes the authenticated user's account under a retention model.
 * Related records (orders, wallet ledger, listings) are kept FULLY intact so
 * order history and audit trails remain valid. The account is hidden from all
 * user-facing views by marking `deletedAt` (which blocks login), and
 * `retainUntil` is set to a provisional 5-year window.
 *
 * The user's email is moved to `previousEmail` and replaced on the row with a
 * placeholder so the address can be reused immediately for a new signup,
 * without waiting out the retention window. A scheduled job anonymizes/purges
 * the record (including `previousEmail`) only after `retainUntil` passes (see
 * lib/account-retention.ts).
 */
export async function DELETE(request: Request) {
  try {
    const userId = await authenticate(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, deletedAt: true },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }
    if (user.deletedAt) {
      return NextResponse.json({ error: "Account already deleted." }, { status: 400 })
    }

    const now = new Date()
    const retainUntil = computeRetainUntil(now)
    // Freed immediately so the same email can be used for a brand-new account,
    // while retaining the original address for support/audit until purge.
    const placeholderEmail = `deleted+${userId}@deleted.soldbay.app`

    await prisma.$transaction(
      async (tx) => {
        await tx.session.deleteMany({ where: { userId } })
        await tx.account.deleteMany({ where: { userId } })
        await tx.user.update({
          where: { id: userId },
          data: {
            previousEmail:
              user.email && user.email !== placeholderEmail ? user.email : null,
            email: placeholderEmail,
            deletedAt: now,
            retainUntil,
          },
        })
      },
      { timeout: 30000, maxWait: 15000 }
    )

    return NextResponse.json({
      ok: true,
      message:
        "Your account has been scheduled for deletion. Your data will be permanently removed after the retention period. You can sign up again with the same email at any time.",
    })
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }
    console.error("Delete user me error:", error)
    return serverErrorResponse()
  }
}
