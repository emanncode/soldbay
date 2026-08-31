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

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          listing: {
            include: { category: true },
          },
          seller: true,
        },
      })

      if (!order || order.buyerId !== userId) {
        throw new Error("ORDER_NOT_FOUND")
      }

      if (order.status !== OrderStatus.AWAITING_CONFIRMATION && order.status !== OrderStatus.PAYMENT_SECURED && order.status !== OrderStatus.PICKUP_ARRANGED) {
        throw new Error("INVALID_STATE")
      }

      const commissionRate = order.listing?.category?.commissionRate ? Number(order.listing.category.commissionRate) : 0.05
      const totalAmount = Number(order.amount)
      const sellerPayout = totalAmount * (1 - commissionRate)

      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: OrderStatus.COMPLETED },
      })

      await tx.sellerProfile.update({
        where: { id: order.sellerId },
        data: {
          walletBalance: { increment: sellerPayout },
        },
      })

      return { updatedOrder, sellerPayout }
    }, { timeout: 30000, maxWait: 15000 })

    return NextResponse.json({
      ok: true,
      id: result.updatedOrder.id,
      status: result.updatedOrder.status,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message === "ORDER_NOT_FOUND") {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }
    if (message === "INVALID_STATE") {
      return NextResponse.json({ error: "Order cannot be confirmed in its current state." }, { status: 400 })
    }
    console.error("Confirm receipt error:", error)
    return NextResponse.json(
      { error: "Something went wrong confirming receipt." },
      { status: 500 }
    )
  }
}
