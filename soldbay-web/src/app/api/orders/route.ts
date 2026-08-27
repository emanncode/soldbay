import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
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

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId },
      select: { id: true },
    })

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: userId },
          ...(seller ? [{ sellerId: seller.id }] : []),
        ],
      },
      include: {
        listing: {
          select: {
            title: true,
            images: true,
            price: true,
          },
        },
        seller: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const mapped = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      title: o.listing?.title || "Item",
      amount: Number(o.amount),
      status: o.status,
      date: o.createdAt.toISOString(),
      sellerUsername: o.seller?.username || "@seller",
      thumbnail: o.listing?.images?.[0] || null,
      isBuyer: o.buyerId === userId,
    }))

    return NextResponse.json({ orders: mapped })
  } catch (error) {
    console.error("List orders error:", error)
    return NextResponse.json(
      { error: "Something went wrong fetching orders." },
      { status: 500 }
    )
  }
}
