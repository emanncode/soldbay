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
 * WITHOUT requiring admin approval.
 *
 * Used where a seller may operate while still pending verification — drafting
 * and managing their own draft listings, viewing their dashboard/wallet. The
 * approval requirement is enforced only at the publishing boundary (and on
 * anything that touches live listings or money) via requireApprovedSeller.
 */
async function resolveSellerUser(
  request: Request,
): Promise<
  | { userId: string; error?: undefined }
  | { userId?: undefined; error: NextResponse }
> {
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

  return { userId }
}

async function findSellerProfile(
  userId: string,
): Promise<SellerActionResult> {
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

  return { seller }
}

/**
 * Authenticates that the request is a SELLER and returns their profile whether
 * or not their verification is approved. Pending/rejected sellers may use
 * seller mode and prepare drafts, but may not publish.
 */
export async function requireSeller(
  request: Request,
): Promise<SellerActionResult> {
  const auth = await resolveSellerUser(request)
  if (auth.error) return { error: auth.error }
  return findSellerProfile(auth.userId)
}

/**
 * Resolves the authenticated seller's profile (mobile bearer or web session)
 * and enforces that they have been APPROVED by an admin.
 *
 * A seller whose verificationStatus is not "APPROVED" — including a brand-new
 * seller who hasn't even submitted verification — is denied here. This is the
 * authoritative server-side gate for everything that makes listings live or
 * handles money (publishing, editing live listings), so a not-yet-approved
 * seller can draft but cannot sell.
 */
export async function requireApprovedSeller(
  request: Request,
): Promise<SellerActionResult> {
  const auth = await resolveSellerUser(request)
  if (auth.error) return { error: auth.error }

  const sellerResult = await findSellerProfile(auth.userId)
  if (sellerResult.error) return sellerResult

  if (sellerResult.seller.verificationStatus !== SELLER_VERIFICATION_STATUS.APPROVED) {
    return {
      error: NextResponse.json(
        {
          error:
            "Your seller account is pending admin approval. You cannot publish or sell yet.",
          verificationStatus: sellerResult.seller.verificationStatus,
        },
        { status: 403 },
      ),
    }
  }

  return { seller: sellerResult.seller }
}
