import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth"

export const SELLER_VERIFICATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const

export type SellerWithUser = {
  id: string
  userId: string
  username: string
  businessName: string | null
  bio: string | null
  walletBalance: unknown
  idImageUrl: string | null
  verifiedAt: Date | null
  verificationStatus: string
  rejectionReason: string | null
  verificationAttempts: number
  user: {
    id: string
    name: string
    email: string
    universityId: string | null
  }
}

export type SellerActionResult =
  | { seller: SellerWithUser; error?: undefined }
  | { seller?: undefined; error: NextResponse }

/**
 * Resolves the authenticated seller's profile (mobile bearer or web session)
 * and enforces that they have been APPROVED by an admin.
 *
 * A seller whose verificationStatus is not "APPROVED" — including a brand-new
 * seller who hasn't even submitted verification — is denied. This is the
 * authoritative server-side gate for seller mode and listing creation, so a
 * not-yet-approved seller can still use buyer mode but cannot sell.
 */
export async function requireApprovedSeller(
  request: Request,
): Promise<SellerActionResult> {
  const bearer = extractBearerToken(request.headers.get("authorization"))
  let userId: string | null = null

  if (bearer) {
    const mobileUser = await verifyActiveMobileToken(bearer)
    if (!mobileUser || mobileUser.role !== "SELLER") {
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      }
    }
    userId = mobileUser.userId
  } else {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "SELLER") {
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      }
    }
    userId = session.user.id
  }

  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  const seller = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: { user: true },
  })

  if (!seller) {
    return {
      error: NextResponse.json(
        { error: "Seller profile not found." },
        { status: 404 },
      ),
    }
  }

  if (seller.verificationStatus !== SELLER_VERIFICATION_STATUS.APPROVED) {
    return {
      error: NextResponse.json(
        {
          error:
            "Your seller account is pending admin approval. You cannot sell yet.",
          verificationStatus: seller.verificationStatus,
        },
        { status: 403 },
      ),
    }
  }

  return { seller }
}
