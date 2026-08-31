import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { DisputeStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

/**
 * Lists disputes for the admin review queue.
 * Optional ?status=OPEN|UNDER_REVIEW|RESOLVED_BUYER_REFUND|RESOLVED_SELLER_PAYOUT|CANCELLED
 * Defaults to open/under-review disputes.
 */
export async function GET(request: Request) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const url = new URL(request.url)
    const requested = url.searchParams.get("status")

    const allowed = [
      "OPEN",
      "UNDER_REVIEW",
      "RESOLVED_BUYER_REFUND",
      "RESOLVED_SELLER_PAYOUT",
      "CANCELLED",
    ]
    if (requested && !allowed.includes(requested)) {
      return NextResponse.json(
        { error: `status must be one of: ${allowed.join(", ")}.` },
        { status: 400 }
      )
    }

    const statuses: DisputeStatus[] = requested
      ? [requested as DisputeStatus]
      : [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW]

    const disputes = await prisma.dispute.findMany({
      where: { status: { in: statuses } },
      select: {
        id: true,
        reason: true,
        status: true,
        resolution: true,
        resolutionNotes: true,
        createdAt: true,
        resolvedAt: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            amount: true,
            status: true,
            buyer: { select: { name: true, email: true } },
            seller: {
              select: {
                id: true,
                username: true,
                user: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ disputes })
  } catch (error) {
    console.error("List disputes error:", error)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
