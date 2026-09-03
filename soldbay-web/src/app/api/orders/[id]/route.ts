import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export async function GET(
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
        listing: {
          include: {
            category: { select: { name: true, slug: true } },
          },
        },
        buyer: {
          select: { id: true, name: true, email: true },
        },
        seller: {
          select: { id: true, username: true, userId: true },
        },
        disputes: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }

    const isBuyer = order.buyerId === userId
    const isSeller = order.seller.userId === userId

    if (!isBuyer && !isSeller) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 })
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      title: order.listing.title,
      description: order.listing.description,
      amount: Number(order.amount),
      status: order.status,
      pickupLocation: order.pickupLocation,
      images: order.listing.images,
      category: order.listing.category,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      sellerUsername: order.seller.username,
      isBuyer,
      isSeller,
      // Security: PIN is revealed ONLY to the seller for in-person handoff display
      sellerPin: isSeller ? order.confirmationPin : undefined,
      pinShownAt: isSeller ? (order.pinShownAt?.toISOString() ?? null) : undefined,
      pinExpiresAt: isSeller ? (order.pinExpiresAt?.toISOString() ?? null) : undefined,
      dispute: order.disputes[0]
        ? {
            id: order.disputes[0].id,
            reason: order.disputes[0].reason,
            status: order.disputes[0].status,
            resolution: order.disputes[0].resolution,
            resolutionNotes: order.disputes[0].resolutionNotes,
          }
        : null,
    })
  } catch (error) {
    console.error("Get order detail error:", error)
    return NextResponse.json(
      { error: "Something went wrong fetching order." },
      { status: 500 }
    )
  }
}
