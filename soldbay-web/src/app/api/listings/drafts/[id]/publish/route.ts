import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"
import { validateListingCompleteness } from "@/lib/listing-validation"

export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      return NextResponse.json({ error: "Seller profile not found." }, { status: 404 })
    }

    if (!seller.user.universityId) {
      return NextResponse.json(
        { error: "Seller must be associated with a university before publishing listings." },
        { status: 403 }
      )
    }

    const draft = await prisma.listing.findFirst({
      where: {
        id,
        sellerId: seller.id,
        status: "DRAFT",
      },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 })
    }

    const validation = validateListingCompleteness({
      title: draft.title,
      description: draft.description,
      price: draft.price ? Number(draft.price) : null,
      categoryId: draft.categoryId,
      images: draft.images,
      stock: draft.stock,
    })

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const published = await prisma.listing.update({
      where: { id },
      data: {
        status: "ACTIVE",
        draftStep: null,
      },
      select: { id: true, status: true },
    })

    return NextResponse.json({ ok: true, id: published.id, status: published.status })
  } catch (error) {
    console.error("Publish draft error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
