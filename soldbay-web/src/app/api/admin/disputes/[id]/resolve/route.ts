import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import {
  resolveDisputeAsRefund,
  resolveDisputeAsReleaseToSeller,
} from "@/lib/order-service"

export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: disputeId } = await params

    // --- Authenticate Admin ---
    let adminUserId: string | null = null
    const bearer = extractBearerToken(request.headers.get("authorization"))

    if (bearer) {
      const mobileUser = await verifyMobileToken(bearer)
      if (!mobileUser || mobileUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
      }
      adminUserId = mobileUser.userId
    } else {
      const session = await auth()
      if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
      }
      adminUserId = session.user.id
    }

    const body = await request.json().catch(() => ({}))
    const { action, resolutionNotes } = body

    if (!action || (action !== "REFUND_BUYER" && action !== "RELEASE_TO_SELLER")) {
      return NextResponse.json(
        { error: "Invalid action. Must be either REFUND_BUYER or RELEASE_TO_SELLER." },
        { status: 400 }
      )
    }

    if (action === "REFUND_BUYER") {
      const result = await resolveDisputeAsRefund({
        disputeId,
        adminUserId: adminUserId || undefined,
        resolutionNotes,
      })
      return NextResponse.json({
        success: true,
        message: "Dispute resolved in buyer favor. Order marked as REFUNDED.",
        data: result,
      })
    } else {
      const result = await resolveDisputeAsReleaseToSeller({
        disputeId,
        adminUserId: adminUserId || undefined,
        resolutionNotes,
      })
      return NextResponse.json({
        success: true,
        message: "Dispute resolved in seller favor. Order marked as COMPLETED and funds released to seller.",
        data: result,
      })
    }
  } catch (error: any) {
    console.error("Dispute resolution error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to resolve dispute" },
      { status: 500 }
    )
  }
}
