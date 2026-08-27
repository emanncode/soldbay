import { prisma } from "@/lib/prisma"
import { OrderStatus, DisputeStatus, DisputeResolution } from "@/generated/prisma/client"

export interface ResolveDisputeParams {
  disputeId: string
  adminUserId?: string
  resolutionNotes?: string
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

    await tx.sellerProfile.update({
      where: { id: dispute.order.sellerId },
      data: {
        walletBalance: {
          increment: payoutAmount,
        },
      },
    })

    return {
      dispute: updatedDispute,
      order: updatedOrder,
      resolutionType: "RELEASE_TO_SELLER",
    }
  }, { timeout: 30000, maxWait: 15000 })
}
