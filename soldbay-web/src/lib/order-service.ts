import { prisma } from "@/lib/prisma"
import { OrderStatus, DisputeStatus, DisputeResolution } from "@/generated/prisma/client"

/**
 * Releases one reserved unit of stock back to a listing (e.g. when an order is
 * rolled back after a failed payment). Idempotent and safe to call regardless of
 * current stock value.
 */
export async function releaseListingStock(listingId: string): Promise<void> {
  await prisma.listing.updateMany({
    where: { id: listingId },
    data: { stock: { increment: 1 } },
  })
}

export interface ResolveDisputeParams {
  disputeId: string
  adminUserId?: string
  resolutionNotes?: string
}

// Window (ms) within which an existing non-terminal order for the same
// buyer + listing is considered a "reuse" of a previous checkout. This makes
// the checkout endpoint idempotent: if the app is killed right after the
// order was created but before the client received the response, a retry
// returns the existing order instead of creating a duplicate and reserving
// stock a second time.
export const CHECKOUT_IDEMPOTENCY_WINDOW_MS = 30 * 60 * 1000 // 30 minutes

// How long an order may sit in PENDING_PAYMENT before it's treated as
// abandoned. Such orders hold a reserved unit of stock indefinitely, so they
// are cancelled and the stock is released.
export const PENDING_PAYMENT_STALE_MS = 24 * 60 * 60 * 1000 // 24 hours

const REUSABLE_STATUSES = [
  OrderStatus.PAYMENT_SECURED,
  OrderStatus.PICKUP_ARRANGED,
  OrderStatus.AWAITING_CONFIRMATION,
]

/**
 * Returns an existing order for the same buyer + listing within the
 * idempotency window that a retried checkout can safely reuse instead of
 * creating a new order. A PENDING_PAYMENT order is reusable only if it is
 * younger than the stale threshold (otherwise it may hold stock that will be
 * released by cleanup). Paid / advanced orders are always reusable.
 */
export async function findReusableCheckoutOrder(
  buyerId: string,
  listingId: string,
  now: Date = new Date(),
): Promise<{ id: string; orderNumber: string; amount: unknown; status: OrderStatus } | null> {
  const cutoff = new Date(now.getTime() - CHECKOUT_IDEMPOTENCY_WINDOW_MS)
  const staleCutoff = new Date(now.getTime() - PENDING_PAYMENT_STALE_MS)

  const candidates = await prisma.order.findMany({
    where: {
      buyerId,
      listingId,
      createdAt: { gte: cutoff },
      OR: [
        { status: { in: REUSABLE_STATUSES } },
        { status: OrderStatus.PENDING_PAYMENT, createdAt: { gt: staleCutoff } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 1,
    select: { id: true, orderNumber: true, amount: true, status: true },
  })

  return candidates[0] ?? null
}

/**
 * Cancels stale PENDING_PAYMENT orders (older than PENDING_PAYMENT_STALE_MS)
 * for a given buyer + listing and releases their reserved stock. Called at
 * checkout time as a lightweight reconciliation sweep, so abandoned orders
 * don't hold stock forever. Idempotent.
 */
export async function releaseStalePendingOrders(
  buyerId: string,
  listingId: string,
  now: Date = new Date(),
): Promise<void> {
  const staleCutoff = new Date(now.getTime() - PENDING_PAYMENT_STALE_MS)

  const stale = await prisma.order.findMany({
    where: {
      buyerId,
      listingId,
      status: OrderStatus.PENDING_PAYMENT,
      createdAt: { lt: staleCutoff },
    },
    select: { id: true, listingId: true },
  })

  if (stale.length === 0) return

  const listingIds = [...new Set(stale.map((o) => o.listingId))]

  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: { id: { in: stale.map((o) => o.id) } },
      data: { status: OrderStatus.CANCELLED },
    })
    for (const lid of listingIds) {
      await tx.listing.updateMany({
        where: { id: lid },
        data: { stock: { increment: 1 } },
      })
    }
  }, { timeout: 30000, maxWait: 15000 })
}

export async function resolveDisputeAsRefund({
  disputeId,
  adminUserId,
  resolutionNotes,
}: ResolveDisputeParams) {
  return await prisma.$transaction(async (tx) => {
    const dispute = await tx.dispute.findUnique({
      where: { id: disputeId },
      include: { order: true },
    })

    if (!dispute) {
      throw new Error("Dispute not found")
    }

    if (
      dispute.status === DisputeStatus.RESOLVED_BUYER_REFUND ||
      dispute.status === DisputeStatus.RESOLVED_SELLER_PAYOUT
    ) {
      throw new Error("Dispute has already been resolved")
    }

    const updatedDispute = await tx.dispute.update({
      where: { id: disputeId },
      data: {
        status: DisputeStatus.RESOLVED_BUYER_REFUND,
        resolution: DisputeResolution.REFUND_BUYER,
        resolutionNotes: resolutionNotes || "Resolved in buyer favor (Refunded)",
        resolvedAt: new Date(),
        resolvedById: adminUserId || null,
      },
    })

    const updatedOrder = await tx.order.update({
      where: { id: dispute.orderId },
      data: {
        status: OrderStatus.REFUNDED,
      },
    })

    return {
      dispute: updatedDispute,
      order: updatedOrder,
      resolutionType: "REFUND",
    }
  }, { timeout: 30000, maxWait: 15000 })
}

export async function resolveDisputeAsReleaseToSeller({
  disputeId,
  adminUserId,
  resolutionNotes,
}: ResolveDisputeParams) {
  return await prisma.$transaction(async (tx) => {
    const dispute = await tx.dispute.findUnique({
      where: { id: disputeId },
      include: {
        order: {
          include: {
            seller: true,
            listing: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!dispute) {
      throw new Error("Dispute not found")
    }

    if (
      dispute.status === DisputeStatus.RESOLVED_BUYER_REFUND ||
      dispute.status === DisputeStatus.RESOLVED_SELLER_PAYOUT
    ) {
      throw new Error("Dispute has already been resolved")
    }

    const updatedDispute = await tx.dispute.update({
      where: { id: disputeId },
      data: {
        status: DisputeStatus.RESOLVED_SELLER_PAYOUT,
        resolution: DisputeResolution.RELEASE_TO_SELLER,
        resolutionNotes: resolutionNotes || "Resolved in seller favor (Funds released)",
        resolvedAt: new Date(),
        resolvedById: adminUserId || null,
      },
    })

    const updatedOrder = await tx.order.update({
      where: { id: dispute.orderId },
      data: {
        status: OrderStatus.COMPLETED,
      },
    })

    // Calculate payout (amount - commission)
    const commissionRate = dispute.order.listing?.category?.commissionRate || 0.05
    const orderAmount = Number(dispute.order.amount)
    const payoutAmount = orderAmount * (1 - Number(commissionRate))

    const updatedProfile = await tx.sellerProfile.update({
      where: { id: dispute.order.sellerId },
      data: {
        walletBalance: {
          increment: payoutAmount,
        },
      },
    })

    // Write a ledger entry for the seller payout (escrow release).
    await tx.walletTransaction.create({
      data: {
        userId: dispute.order.seller.userId,
        type: "PAYOUT",
        amount: payoutAmount,
        balanceAfter: Number(updatedProfile.walletBalance),
        description: `Payout for order ${dispute.order.orderNumber}`,
        orderId: dispute.order.id,
      },
    })

    return {
      dispute: updatedDispute,
      order: updatedOrder,
      resolutionType: "RELEASE_TO_SELLER",
    }
  }, { timeout: 30000, maxWait: 15000 })
}
