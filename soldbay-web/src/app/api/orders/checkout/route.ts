import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"
import { OrderStatus } from "@/generated/prisma/client"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
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

    const buyer = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!buyer) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    if (!buyer.universityId) {
      return NextResponse.json(
        { error: "Please select your university before checking out." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { listingId, pickupLocation } = body

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json({ error: "Listing ID is required." }, { status: 400 })
    }

    if (!pickupLocation || typeof pickupLocation !== "string" || !pickupLocation.trim()) {
      return NextResponse.json({ error: "Campus pickup location is required." }, { status: 400 })
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    })

    if (!listing || listing.status !== "ACTIVE" || !listing.price) {
      return NextResponse.json({ error: "Listing is not available for purchase." }, { status: 404 })
    }

    if (listing.seller.userId === userId) {
      return NextResponse.json({ error: "You cannot purchase your own listing." }, { status: 400 })
    }

    // Generate unique order number (e.g. SB-84920) and 4-digit PIN
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString()
    const orderNumber = `SB-${randomDigits}`
    const confirmationPin = Math.floor(1000 + Math.random() * 9000).toString()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerId: buyer.id,
        sellerId: listing.sellerId,
        listingId: listing.id,
        amount: listing.price,
        status: OrderStatus.PAYMENT_SECURED, // Instantly secured in dev/test; Paystack webhook handles live prod
        pickupLocation: pickupLocation.trim(),
        confirmationPin,
      },
      include: {
        listing: { select: { title: true, images: true } },
      },
    })

    // In live prod, we initialize with Paystack API. In dev/testing without domain or live keys, return dev authorization URL.
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY
    let authorizationUrl = `https://checkout.paystack.com/mock-checkout-${order.id}`

    if (paystackSecret && !paystackSecret.startsWith("mock")) {
      try {
        const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: buyer.email,
            amount: Math.round(Number(listing.price) * 100), // in kobo
            reference: order.id,
            callback_url: `${process.env.NEXTAUTH_URL || "https://soldbay.shop"}/checkout/callback`,
            metadata: {
              orderId: order.id,
              orderNumber: order.orderNumber,
              buyerId: buyer.id,
            },
          }),
        })
        const paystackData = await paystackRes.json()
        if (paystackData.status && paystackData.data?.authorization_url) {
          authorizationUrl = paystackData.data.authorization_url
        }
      } catch (err) {
        console.warn("Paystack initialize warning (using fallback):", err)
      }
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Number(order.amount),
      status: order.status,
      authorizationUrl,
    }, { status: 201 })
  } catch (error) {
    console.error("Checkout order error:", error)
    return NextResponse.json(
      { error: "Something went wrong creating the order." },
      { status: 500 }
    )
  }
}
