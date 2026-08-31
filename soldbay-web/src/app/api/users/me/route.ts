import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

async function authenticate(request: Request): Promise<string | null> {
  const bearer = extractBearerToken(request.headers.get("authorization"))

  if (bearer) {
    const mobileUser = await verifyMobileToken(bearer)
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
        level: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Get user me error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await authenticate(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const data: { universityId?: string; level?: string } = {}

    if (body.universityId !== undefined) {
      if (typeof body.universityId !== "string") {
        return NextResponse.json(
          { error: "universityId must be a string." },
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

    if (body.level !== undefined) {
      data.level = typeof body.level === "string" ? body.level : null
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
        level: true,
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
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

/**
 * Soft-deletes the authenticated user's account. The record is retained for
 * audit/order-history integrity but marked deleted, the email is anonymized
 * (freeing it for a future signup), the password is cleared, and all sessions
 * and OAuth accounts are revoked so the account can no longer sign in.
 */
export async function DELETE(request: Request) {
  try {
    const userId = await authenticate(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, deletedAt: true },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }
    if (user.deletedAt) {
      return NextResponse.json({ error: "Account already deleted." }, { status: 400 })
    }

    const anonymizedEmail = `deleted+${user.id}@deleted.soldbay.app`

    await prisma.$transaction(
      async (tx) => {
        await tx.session.deleteMany({ where: { userId } })
        await tx.account.deleteMany({ where: { userId } })
        await tx.user.update({
          where: { id: userId },
          data: {
            deletedAt: new Date(),
            email: anonymizedEmail,
            password: null,
            matricNumber: null,
          },
        })
      },
      { timeout: 30000, maxWait: 15000 }
    )

    return NextResponse.json({
      ok: true,
      message: "Your account has been deleted.",
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
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
