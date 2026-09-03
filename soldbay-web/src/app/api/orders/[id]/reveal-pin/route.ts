import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth"
import { OrderStatus } from "@/generated/prisma/client"
import { PIN_SHOWN_WINDOW_MS } from "@/lib/pin-timing"

export const dynamic = "force-dynamic"

/**
 * Seller taps "Show Code" on the handoff screen.
 *
 * This is the "about to drop the product" moment: it explicitly reveals the PIN
 * and starts a fresh expiry window. Repeated taps simply reset the window. It
 * does NOT affect the failed-attempt lockout, which is an independent safeguard.
 */
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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        seller: { select: { userId: true } },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }

    // Only the seller may reveal the PIN.
    if (order.seller.userId !== userId) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }

    if (
      order.status !== OrderStatus.PAYMENT_SECURED &&
      order.status !== OrderStatus.PICKUP_ARRANGED
    ) {
      return NextResponse.json(
        { error: `Cannot reveal PIN for an order in ${order.status} state.` },
        { status: 400 }
      )
    }

    if (!order.confirmationPin) {
      return NextResponse.json(
        { error: "This order has no confirmation PIN." },
        { status: 400 }
      )
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + PIN_SHOWN_WINDOW_MS)

    const updated = await prisma.order.update({
      where: { id },
      data: {
        pinShownAt: now,
        pinExpiresAt: expiresAt,
      },
      select: { id: true, status: true, pinShownAt: true, pinExpiresAt: true },
    })

    return NextResponse.json({
      ok: true,
      id: updated.id,
      status: updated.status,
      pinShownAt: updated.pinShownAt?.toISOString() ?? null,
      pinExpiresAt: updated.pinExpiresAt?.toISOString() ?? null,
      expiresInSeconds: Math.floor(PIN_SHOWN_WINDOW_MS / 1000),
    })
  } catch (error) {
    console.error("Reveal PIN error:", error)
    return NextResponse.json(
      { error: "Something went wrong revealing PIN." },
      { status: 500 }
    )
  }
}
