import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { releaseListingStock } from "@/lib/order-service"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"
import { OrderStatus } from "@/generated/prisma/client"

export const dynamic = "force-dynamic"

class OutOfStockError extends Error {}

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

    // Capture the price outside the transaction so TS narrowing holds inside the
    // closure (narrowing does not propagate into nested functions).
    const orderAmount = listing.price
    if (listing.seller.userId === userId) {
      return NextResponse.json({ error: "You cannot purchase your own listing." }, { status: 400 })
    }

    // Generate unique order number (e.g. SB-84920) and 4-digit PIN
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString()
    const orderNumber = `SB-${randomDigits}`
    const confirmationPin = Math.floor(1000 + Math.random() * 9000).toString()

    // ---------------------------------------------------------------------------
    // TEMPORARY TEST-ONLY BYPASS — REMOVE BEFORE PRODUCTION DEPLOY.
    //
    // When TEST_MODE=true (server-side env, defaults to OFF), orders are created
    // directly in the PAYMENT_SECURED state, skipping the real Paystack payment
    // flow entirely. This is for local/dev/testing only and MUST NOT be enabled
    // in production. It is enforced on the backend (not just hidden in the UI).
    // ---------------------------------------------------------------------------
    const testMode = process.env.TEST_MODE === "true"
    // Resolve whether a real (non-mock) Paystack secret is configured.
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY
    const paystackConfigured = Boolean(
      paystackSecret && !paystackSecret.startsWith("mock")
    )

    let order: Awaited<ReturnType<typeof prisma.order.create>> | null = null
    try {
      // Atomically reserve one unit of stock while creating the order. The
      // conditional UPDATE only matches stock > 0, so concurrent checkouts of
      // the last unit cannot both succeed — exactly one reserves it.
      order = await prisma.$transaction(
        async (tx) => {
          const reserved = await tx.listing.updateMany({
            where: { id: listing.id, stock: { gt: 0 }, status: "ACTIVE" },
            data: { stock: { decrement: 1 } },
          })
          if (reserved.count === 0) {
            throw new OutOfStockError()
          }
          return tx.order.create({
            data: {
              orderNumber,
              buyerId: buyer.id,
              sellerId: listing.sellerId,
              listingId: listing.id,
              amount: orderAmount,
              status: testMode
                ? OrderStatus.PAYMENT_SECURED // TEST ONLY: bypass real payment.
                : OrderStatus.PENDING_PAYMENT, // Real flow: wait for Paystack webhook.
              pickupLocation: pickupLocation.trim(),
              confirmationPin,
            },
            include: {
              listing: { select: { title: true, images: true } },
            },
          })
        },
        { timeout: 30000, maxWait: 15000 }
      )
    } catch (error) {
      if (error instanceof OutOfStockError) {
        return NextResponse.json(
          { error: "This item is no longer in stock." },
          { status: 409 }
        )
      }
      throw error
    }

    // Control only reaches here if the reservation + order creation succeeded.
    if (!order) {
      throw new Error("Failed to create order")
    }

    // TEST MODE: skip Paystack entirely and return immediately. The order is
    // already marked PAYMENT_SECURED (see above).
    if (testMode) {
      return NextResponse.json({
        ok: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: Number(order.amount),
        status: order.status,
        testMode: true,
        note: "TEST_MODE bypass: payment was NOT processed by Paystack.",
      }, { status: 201 })
    }

    // Live flow: a real Paystack key is REQUIRED outside TEST_MODE. Refuse to
    // create a PAYMENT_SECURED order without going through an actual payment.
    if (!paystackConfigured) {
      // Roll back the pending order so we don't leak unsecured orders, and
      // release the reserved unit of stock back to the listing.
      await prisma.order.delete({ where: { id: order.id } })
      await releaseListingStock(listing.id)
      return NextResponse.json(
        { error: "Payment is not configured. Cannot process this order." },
        { status: 503 }
      )
    }

    let authorizationUrl: string | null = null
    try {
      const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: buyer.email,
          amount: Math.round(Number(orderAmount) * 100), // in kobo
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
      console.error("Paystack initialize error:", err)
      // Roll back the pending order so we don't leak unsecured orders, and
      // release the reserved unit of stock back to the listing.
      await prisma.order.delete({ where: { id: order.id } })
      await releaseListingStock(listing.id)
      return NextResponse.json(
        { error: "Payment provider error. Please try again." },
        { status: 502 }
      )
    }

    if (!authorizationUrl) {
      await prisma.order.delete({ where: { id: order.id } })
      await releaseListingStock(listing.id)
      return NextResponse.json(
        { error: "Could not initialize payment. Please try again." },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Number(order.amount),
      status: order.status,
      authorizationUrl,
      testMode: false,
    }, { status: 201 })
  } catch (error) {
    console.error("Checkout order error:", error)
    return NextResponse.json(
      { error: "Something went wrong creating the order." },
      { status: 500 }
    )
  }
}
