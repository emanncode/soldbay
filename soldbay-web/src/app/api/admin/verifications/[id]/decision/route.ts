import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

async function assertAdmin(request: Request): Promise<boolean> {
  const bearer = extractBearerToken(request.headers.get("authorization"))
  if (bearer) {
    const mobileUser = await verifyActiveMobileToken(bearer)
    return mobileUser?.role === "ADMIN"
  }
  const session = await auth()
  return session?.user?.role === "ADMIN"
}

/**
 * Approves or rejects a seller petition / student verification.
 *
 * APPROVE:
 *  - Flips the owner's User.role to SELLER in the SAME transaction, which is
 *    what actually grants the buyer seller mode. Not flipping here would
 *    strand them: the proposal flow deliberately keeps role == BUYER so a
 *    petitioning buyer stays fully in buyer mode until admin approval.
 *  - The role value is hardcoded; nothing from the request can influence it.
 * REJECT (reason required): sets status REJECTED, keeps the user a BUYER, and
 *  clears any prior approval. The seller may petition again.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await assertAdmin(request))) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const action = body.action
    const reason = typeof body.reason === "string" ? body.reason.slice(0, 1000).trim() : ""

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { error: "action must be APPROVE or REJECT." },
        { status: 400 }
      )
    }
    if (action === "REJECT" && !reason) {
      return NextResponse.json(
        { error: "A rejection reason is required." },
        { status: 400 }
      )
    }

    const updated = await prisma.$transaction(
      async (tx) => {
        const profile = await tx.sellerProfile.findUnique({
          where: { id },
          select: { id: true, verificationStatus: true },
        })
        if (!profile) {
          return null
        }

        return tx.sellerProfile.update({
          where: { id },
          data:
            action === "APPROVE"
              ? {
                  verificationStatus: "APPROVED",
                  rejectionReason: null,
                  verifiedAt: new Date(),
                  user: { update: { role: "SELLER" } },
                }
              : {
                  verificationStatus: "REJECTED",
                  rejectionReason: reason,
                  verifiedAt: null,
                },
          select: {
            id: true,
            verificationStatus: true,
            rejectionReason: true,
            verifiedAt: true,
          },
        })
      },
      { timeout: 30000, maxWait: 45000 },
    )

    if (!updated) {
      return NextResponse.json({ error: "Seller profile not found." }, { status: 404 })
    }

    return NextResponse.json({
      ok: true,
      action,
      verification: updated,
    })
  } catch (error) {
    console.error("Verification decision error:", error)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
