import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const bearer = extractBearerToken(request.headers.get("authorization"))
    let userId: string | null = null

    if (bearer) {
      const mobileUser = await verifyMobileToken(bearer)
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

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: { user: true },
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Seller profile not found." },
        { status: 404 },
      )
    }

    if (!seller.user.universityId) {
      return NextResponse.json(
        {
          error:
            "Seller must be associated with a university before creating listings.",
        },
        { status: 403 },
      )
    }

    const draft = await prisma.listing.create({
      data: {
        sellerId: seller.id,
        status: "DRAFT",
        draftStep: 1,
        images: [],
      },
      select: { id: true },
    })

    return NextResponse.json({ id: draft.id }, { status: 201 })
  } catch (error) {
    console.error("Create draft error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
