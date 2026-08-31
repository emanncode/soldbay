import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

async function assertAdmin(request: Request): Promise<boolean> {
  const bearer = extractBearerToken(request.headers.get("authorization"))
  if (bearer) {
    const mobileUser = await verifyMobileToken(bearer)
    return mobileUser?.role === "ADMIN"
  }
  const session = await auth()
  return session?.user?.role === "ADMIN"
}

/**
 * Lists seller verification requests for the admin review queue.
 * Optional ?status=PENDING|APPROVED|REJECTED filter (default: PENDING).
 */
export async function GET(request: Request) {
  try {
    if (!(await assertAdmin(request))) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get("status") || "PENDING"
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "status must be PENDING, APPROVED, or REJECTED." },
        { status: 400 }
      )
    }

    const profiles = await prisma.sellerProfile.findMany({
      where: { verificationStatus: status },
      select: {
        id: true,
        username: true,
        businessName: true,
        verificationStatus: true,
        rejectionReason: true,
        verificationAttempts: true,
        verifiedAt: true,
        idImageUrl: true,
        user: {
          select: {
            name: true,
            email: true,
            matricNumber: true,
            university: { select: { name: true, code: true } },
          },
        },
      },
      orderBy: { verifiedAt: "asc" },
    })

    return NextResponse.json({
      profiles: profiles.map((p) => ({
        ...p,
        hasImage: Boolean(p.idImageUrl),
        idImageUrl: p.idImageUrl ? undefined : null,
        university: p.user.university,
      })),
    })
  } catch (error) {
    console.error("List verifications error:", error)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
