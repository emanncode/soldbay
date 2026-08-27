import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"
import { OrderStatus, DisputeStatus } from "@/generated/prisma/client"

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
    const reason = typeof body.reason === "string" ? body.reason.trim() : ""

    if (!reason) {
      return NextResponse.json({ error: "Please describe the problem with the item." }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
      })

      if (!order || order.buyerId !== userId) {
        throw new Error("ORDER_NOT_FOUND")
      }

      if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.REFUNDED) {
        throw new Error("ORDER_ALREADY_CLOSED")
      }

      const dispute = await tx.dispute.create({
        data: {
          orderId: order.id,
          buyerId: userId,
          reason,
          status: DisputeStatus.UNDER_REVIEW,
        },
      })

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.DISPUTED },
      })

      return { dispute, updatedOrder }
    })

    return NextResponse.json({
      ok: true,
      disputeId: result.dispute.id,
      status: result.updatedOrder.status,
    }, { status: 201 })
  } catch (error: any) {
    if (error?.message === "ORDER_NOT_FOUND") {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }
    if (error?.message === "ORDER_ALREADY_CLOSED") {
      return NextResponse.json({ error: "Cannot raise a dispute on a completed or refunded order." }, { status: 400 })
    }
    console.error("Raise dispute error:", error)
    return NextResponse.json(
      { error: "Something went wrong submitting your dispute." },
      { status: 500 }
    )
  }
}
