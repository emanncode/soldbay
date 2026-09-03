import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth"
import { OrderStatus, WalletTransactionType } from "@/generated/prisma/client"

export const dynamic = "force-dynamic"

interface WalletLedgerEntry {
  id: string
  type: WalletTransactionType
  amount: number
  balanceAfter: number
  description: string
  orderId: string | null
  createdAt: string
}

/**
 * Returns the authenticated user's wallet ledger.
 *
 * - Sellers: a real running balance (SellerProfile.walletBalance) plus a list
 *   of PAYOUT transactions recorded when escrow funds were released.
 * - Buyers: an informational ledger derived from their escrow order activity
 *   (hold on payment secured, release on completion, refund). Buyer balance is
 *   reported as 0 because real funds flow through the external payment
 *   provider, which is out of scope.
 */
export async function GET(request: Request) {
  try {
    const bearer = extractBearerToken(request.headers.get("authorization"))
    let userId: string | null = null
    let role: string | null = null

    if (bearer) {
      const mobileUser = await verifyActiveMobileToken(bearer)
      if (!mobileUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = mobileUser.userId
      role = mobileUser.role
    } else {
      const session = await auth()
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = session.user.id
      role = session.user.role ?? null
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isSeller = role === "SELLER"

    if (isSeller) {
      const profile = await prisma.sellerProfile.findUnique({
        where: { userId },
        select: {
          walletBalance: true,
          user: { select: { id: true } },
        },
      })

      const transactions = await prisma.walletTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      })

      return NextResponse.json({
        role: "SELLER",
        balance: profile?.walletBalance ?? 0,
        currency: "NGN",
        transactions: transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: Number(t.amount),
          balanceAfter: Number(t.balanceAfter),
          description: t.description,
          orderId: t.orderId,
          createdAt: t.createdAt.toISOString(),
        })),
      })
    }

    // Buyer: informational escrow ledger derived from orders.
    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        orderNumber: true,
        amount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        listing: { select: { title: true } },
      },
    })

    const transactions = orders.flatMap((o): WalletLedgerEntry[] => {
      const amount = Number(o.amount)
      const itemTitle = o.listing?.title || "item"
      switch (o.status) {
        case OrderStatus.PAYMENT_SECURED:
        case OrderStatus.PICKUP_ARRANGED:
        case OrderStatus.AWAITING_CONFIRMATION:
        case OrderStatus.DISPUTED:
          return [
            {
              id: `${o.id}-hold`,
              type: WalletTransactionType.ESCROW_HOLD,
              amount,
              balanceAfter: 0,
              description: `Escrow hold for "${itemTitle}"`,
              orderId: o.id,
              createdAt: o.createdAt.toISOString(),
            },
          ]
        case OrderStatus.COMPLETED:
          return [
            {
              id: `${o.id}-hold`,
              type: WalletTransactionType.ESCROW_HOLD,
              amount,
              balanceAfter: 0,
              description: `Escrow hold for "${itemTitle}"`,
              orderId: o.id,
              createdAt: o.createdAt.toISOString(),
            },
            {
              id: `${o.id}-release`,
              type: WalletTransactionType.ESCROW_RELEASE,
              amount,
              balanceAfter: 0,
              description: `Escrow released for "${itemTitle}"`,
              orderId: o.id,
              createdAt: o.updatedAt.toISOString(),
            },
          ]
        case OrderStatus.REFUNDED:
          return [
            {
              id: `${o.id}-hold`,
              type: WalletTransactionType.ESCROW_HOLD,
              amount,
              balanceAfter: 0,
              description: `Escrow hold for "${itemTitle}"`,
              orderId: o.id,
              createdAt: o.createdAt.toISOString(),
            },
            {
              id: `${o.id}-refund`,
              type: WalletTransactionType.REFUND,
              amount,
              balanceAfter: 0,
              description: `Refund for "${itemTitle}"`,
              orderId: o.id,
              createdAt: o.updatedAt.toISOString(),
            },
          ]
        default:
          return []
      }
    })

    // Sort by created date descending (oldest first rendered last).
    transactions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({
      role: "BUYER",
      balance: 0,
      currency: "NGN",
      transactions,
    })
  } catch (error) {
    console.error("Get wallet error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
