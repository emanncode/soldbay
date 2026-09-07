import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serverErrorResponse } from "@/lib/api-error"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

const MAX_USERNAME_LENGTH = 30
const MAX_USERNAME_GENERATION_ATTEMPTS = 50

/**
 * Builds a username from a seller's name without ever trusting client input.
 * Non-alphanumeric characters are stripped so nothing a user types (or an
 * attacker injects) can ever reach the database other than as a safe slug.
 * A numeric suffix is appended on collision so the handle stays unique.
 */

function slugifyUsername(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "")
    .slice(0, MAX_USERNAME_LENGTH)
  return slug || "seller"
}

async function generateUniqueUsername(
  tx: {
    sellerProfile: {
      findUnique: (args: {
        where: { username: string }
      }) => Promise<{ id: string } | null>
    }
  },
  baseSlug: string,
): Promise<string> {
  for (let attempt = 0; attempt < MAX_USERNAME_GENERATION_ATTEMPTS; attempt++) {
    const suffix = String(attempt + 2)
    const username =
      attempt === 0
        ? baseSlug
        : `${baseSlug.slice(0, MAX_USERNAME_LENGTH - suffix.length)}${suffix}`
    const existing = await tx.sellerProfile.findUnique({ where: { username } })
    if (!existing) return username
  }
  throw new Error("Could not generate a unique store username")
}

type PetitionResult =
  | { status: 201; alreadyPending: false; sellerProfileId: string; attempts: number }
  | { status: 200; alreadyPending: true; sellerProfileId: string; attempts: number }
  | { status: 401; error: string }
  | { status: 403; error: string }
  | { status: 409; error: string }

/**
 * A BUYER petitions to become a campus seller WITHOUT leaving buyer mode.
 *
 * Unlike the old "upgrade" flow, this never flips User.role and never re-signs
 * a SELLER token. The user stays a BUYER (JWT unchanged) until an admin approves
 * the petition via POST /api/admin/verifications/[id]/decision — which flips the
 * role only inside that admin-only transaction.
 *
 * Security posture:
 *  - The request body is deliberately NEVER read. There are no client-supplied
 *    fields to mass-assign or inject; the username is derived server-side from
 *    the stored user name and sanitized to [a-z0-9].
 *  - The transaction re-checks the user (existence, deletion, role, university)
 *    rather than trusting anything from the request.
 */
export async function POST(_request: Request) {
  let userId: string | null = null
  try {
    const bearer = extractBearerToken(_request.headers.get("authorization"))

    if (bearer) {
      const mobileUser = await verifyActiveMobileToken(bearer)
      if (!mobileUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = mobileUser.userId
    } else {
      const session = await auth()
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = session.user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const activeUserId = userId

    const result = await prisma.$transaction<PetitionResult>(
      async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: activeUserId },
          select: {
            id: true,
            name: true,
            role: true,
            universityId: true,
            deletedAt: true,
          },
        })

        if (!user || user.deletedAt) {
          return { status: 401 as const, error: "Unauthorized" as const }
        }

        if (user.role === "SELLER") {
          return {
            status: 409 as const,
            error: "You're already a campus seller." as const,
          }
        }

        if (!user.universityId) {
          return {
            status: 403 as const,
            error:
              "Please select your university before petitioning to become a campus seller." as const,
          }
        }

        const existing = await tx.sellerProfile.findUnique({
          where: { userId: user.id },
        })

        if (existing?.verificationStatus === "APPROVED") {
          return {
            status: 409 as const,
            error: "Your seller account is already approved." as const,
          }
        }

        if (existing?.verificationStatus === "PENDING") {
          return {
            status: 200 as const,
            alreadyPending: true as const,
            sellerProfileId: existing.id,
            attempts: existing.verificationAttempts,
          }
        }

        if (existing) {
          // REJECTED → re-petition: clear the rejection and restart the review
          // cycle, counting the attempt so a support escalation can be signalled.
          const updated = await tx.sellerProfile.update({
            where: { id: existing.id },
            data: {
              verificationStatus: "PENDING",
              rejectionReason: null,
              verifiedAt: null,
              verificationAttempts: { increment: 1 },
            },
            select: { id: true, verificationAttempts: true },
          })
          return {
            status: 201 as const,
            alreadyPending: false as const,
            sellerProfileId: updated.id,
            attempts: updated.verificationAttempts,
          }
        }

        const username = await generateUniqueUsername(tx, slugifyUsername(user.name))
        const created = await tx.sellerProfile.create({
          data: {
            userId: user.id,
            username,
            verificationStatus: "PENDING",
          },
          select: { id: true, verificationAttempts: true },
        })

        return {
          status: 201 as const,
          alreadyPending: false as const,
          sellerProfileId: created.id,
          attempts: created.verificationAttempts,
        }
      },
      { timeout: 30000, maxWait: 45000 },
    )

    if (result.status === 401 || result.status === 403 || result.status === 409) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json(
      {
        ok: true,
        alreadyPending: result.alreadyPending,
        sellerProfileId: result.sellerProfileId,
        verificationStatus: "PENDING",
        attempts: result.attempts,
      },
      { status: result.status },
    )
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      // Concurrent petition (userId unique) — treat as already petitioned.
      const profile = await prisma.sellerProfile.findUnique({
        where: { userId: userId! },
        select: { id: true, verificationStatus: true, verificationAttempts: true },
      })
      if (profile && profile.verificationStatus === "PENDING") {
        return NextResponse.json({
          ok: true,
          alreadyPending: true,
          sellerProfileId: profile.id,
          verificationStatus: "PENDING",
          attempts: profile.verificationAttempts,
        })
      }
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 409 },
      )
    }

    console.error("Seller petition error:", error)
    return serverErrorResponse()
  }
}

/**
 * Returns the authenticated user's petition status so the app can show
 * "awaiting approval" (PENDING), a rejection with reason (REJECTED), an
 * approved account (APPROVED), or no petition yet (NONE) when reopening the
 * request screen. Read-only and safe.
 */
export async function GET(request: Request) {
  try {
    const bearer = extractBearerToken(request.headers.get("authorization"))
    let userId: string | null = null

    if (bearer) {
      const mobileUser = await verifyActiveMobileToken(bearer)
      if (!mobileUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = mobileUser.userId
    } else {
      const session = await auth()
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = session.user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.sellerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        verificationStatus: true,
        rejectionReason: true,
        verificationAttempts: true,
      },
    })

    if (!profile) {
      return NextResponse.json({
        ok: true,
        petitionStatus: "NONE",
        sellerProfileId: null,
      })
    }

    return NextResponse.json({
      ok: true,
      petitionStatus: profile.verificationStatus,
      sellerProfileId: profile.id,
      rejectionReason: profile.rejectionReason,
      verificationAttempts: profile.verificationAttempts,
    })
  } catch (error) {
    console.error("Petition status error:", error)
    return serverErrorResponse()
  }
}