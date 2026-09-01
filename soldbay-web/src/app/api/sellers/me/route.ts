import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // --- Authenticate ---
    const bearer = extractBearerToken(request.headers.get("authorization"))
    let userId: string | null = null

    if (bearer) {
      const mobileUser = await verifyActiveMobileToken(bearer)
      if (!mobileUser || mobileUser.role !== "SELLER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = mobileUser.userId
    } else {
      const session = await auth()
      if (!session?.user?.id || session.user.role !== "SELLER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = session.user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // --- Fetch seller profile ---
    const profile = await prisma.sellerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        username: true,
        walletBalance: true,
        verifiedAt: true,
        idImageUrl: true,
        verificationStatus: true,
        rejectionReason: true,
        verificationAttempts: true,
        user: {
          select: { name: true },
        },
        listings: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            stock: true,
            status: true,
            draftStep: true,
            createdAt: true,
            updatedAt: true,
            category: {
              select: { name: true, slug: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Seller profile not found." },
        { status: 404 },
      )
    }

    const drafts = profile.listings
      .filter((l) => l.status === "DRAFT")
      .map((d) => ({
        id: d.id,
        title: d.title,
        images: d.images,
        draftStep: d.draftStep,
        updatedAt: d.updatedAt.toISOString(),
      }))

    const listings = profile.listings.filter((l) => l.status !== "DRAFT")

    return NextResponse.json({
      sellerProfileId: profile.id,
      username: profile.username,
      name: profile.user.name,
      walletBalance: profile.walletBalance,
      verified: profile.verifiedAt !== null,
      verifiedAt: profile.verifiedAt,
      idImageUrl: profile.idImageUrl,
      verificationStatus: profile.verificationStatus,
      rejectionReason: profile.rejectionReason,
      verificationAttempts: profile.verificationAttempts,
      listings,
      drafts,
    })
  } catch (error) {
    console.error("Get seller me error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
