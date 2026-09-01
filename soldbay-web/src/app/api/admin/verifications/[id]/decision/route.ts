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
 * Approves or rejects a seller's student verification. Rejection requires a
 * reason (surfaced to the seller on the app's "rejected" screen).
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
    const reason = typeof body.reason === "string" ? body.reason.trim() : ""

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

    const profile = await prisma.sellerProfile.findUnique({
      where: { id },
      select: { id: true, verificationStatus: true },
    })
    if (!profile) {
      return NextResponse.json({ error: "Seller profile not found." }, { status: 404 })
    }

    const updated = await prisma.sellerProfile.update({
      where: { id },
      data:
        action === "APPROVE"
          ? {
              verificationStatus: "APPROVED",
              rejectionReason: null,
              verifiedAt: new Date(),
            }
          : {
              verificationStatus: "REJECTED",
              rejectionReason: reason,
            },
      select: {
        id: true,
        verificationStatus: true,
        rejectionReason: true,
        verifiedAt: true,
      },
    })

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
