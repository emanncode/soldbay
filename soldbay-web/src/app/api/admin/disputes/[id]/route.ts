import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Returns full detail for a single dispute, including the buyer, seller,
 * listing, and the seller's verification image (served privately via the
 * id-image endpoint using sellerProfileId).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const { id } = await params

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                price: true,
                images: true,
                category: { select: { name: true, commissionRate: true } },
              },
            },
            buyer: {
              select: {
                name: true,
                email: true,
                university: { select: { name: true } },
              },
            },
            seller: {
              select: {
                id: true,
                username: true,
                verifiedAt: true,
                user: { select: { name: true, email: true, matricNumber: true } },
              },
            },
          },
        },
      },
    })

    if (!dispute) {
      return NextResponse.json({ error: "Dispute not found." }, { status: 404 })
    }

    return NextResponse.json({
      dispute: {
        id: dispute.id,
        reason: dispute.reason,
        status: dispute.status,
        resolution: dispute.resolution,
        resolutionNotes: dispute.resolutionNotes,
        resolvedAt: dispute.resolvedAt,
        createdAt: dispute.createdAt,
        sellerProfileId: dispute.order.sellerId,
        order: dispute.order,
      },
    })
  } catch (error) {
    console.error("Get dispute error:", error)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
