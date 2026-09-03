import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth"
import { OrderStatus } from "@/generated/prisma/client"

export const dynamic = "force-dynamic"

// Brute-force protection for the 4-digit handoff PIN. After 5 failed attempts
// the order's PIN entry is locked for 15 minutes before retries are allowed.
const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    const pin = typeof body.pin === "string" ? body.pin.trim() : ""

    if (!pin || pin.length !== 4) {
      return NextResponse.json({ error: "4-digit PIN is required." }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order || order.buyerId !== userId) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }

    if (order.status !== OrderStatus.PAYMENT_SECURED && order.status !== OrderStatus.PICKUP_ARRANGED) {
      return NextResponse.json(
        { error: `Cannot verify PIN for an order in ${order.status} state.` },
        { status: 400 }
      )
    }

    const now = new Date()

    // If the PIN was revealed (expiry window started) but has since expired,
    // reject with a clear, distinct message so the buyer asks the seller to
    // show the code again. This is independent of the failed-attempt lockout.
    if (order.pinExpiresAt && order.pinExpiresAt <= now) {
      return NextResponse.json(
        {
          error: "This code expired, ask the seller to show it again.",
          expired: true,
        },
        { status: 410 }
      )
    }

    // If the order is currently locked, reject any attempt until the lock expires.
    if (order.pinLockedUntil && order.pinLockedUntil > now) {
      const retryAfterMs = order.pinLockedUntil.getTime() - now.getTime()
      return NextResponse.json(
        {
          error: "Too many incorrect PIN attempts. Please try again later.",
          retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
        },
        { status: 429 }
      )
    }

    // The previous lock has expired: clear it and reset the failure counter so a
    // fresh window of attempts is allowed.
    if (order.pinLockedUntil && order.pinLockedUntil <= now) {
      await prisma.order.update({
        where: { id },
        data: { pinLockedUntil: null, pinFailedAttempts: 0 },
      })
    }

    if (order.confirmationPin !== pin) {
      // Atomically increment the failure counter and capture the new value so
      // concurrent requests can't race past the lock threshold.
      const failed = await prisma.order.update({
        where: { id },
        data: { pinFailedAttempts: { increment: 1 } },
        select: { pinFailedAttempts: true },
      })

      if (failed.pinFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = new Date(now.getTime() + LOCK_DURATION_MS)
        await prisma.order.update({
          where: { id },
          data: { pinLockedUntil: lockedUntil, pinFailedAttempts: 0 },
        })
        return NextResponse.json(
          {
            error: "Too many incorrect PIN attempts. PIN entry is locked for 15 minutes.",
            retryAfterSeconds: Math.ceil(LOCK_DURATION_MS / 1000),
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          error: "Incorrect PIN. Please check the code displayed on the seller's phone.",
          attemptsRemaining: MAX_FAILED_ATTEMPTS - failed.pinFailedAttempts,
        },
        { status: 400 }
      )
    }

    // Correct PIN: reset any lock/failure state and advance the order.
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.AWAITING_CONFIRMATION,
        pinFailedAttempts: 0,
        pinLockedUntil: null,
      },
      select: { id: true, status: true },
    })

    return NextResponse.json({ ok: true, id: updated.id, status: updated.status })
  } catch (error) {
    console.error("Verify PIN error:", error)
    return NextResponse.json(
      { error: "Something went wrong verifying PIN." },
      { status: 500 }
    )
  }
}
