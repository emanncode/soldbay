import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"
import { OrderStatus } from "@/generated/prisma/client"

export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bearer = extractBearerToken(request.headers.get("authorization"))
    let userId: string | null = null

    if (bearer) {
      const mobileUser = await verifyMobileToken(bearer)
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

    if (order.confirmationPin !== pin) {
      return NextResponse.json(
        { error: "Incorrect PIN. Please check the code displayed on the seller's phone." },
        { status: 400 }
      )
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.AWAITING_CONFIRMATION,
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
