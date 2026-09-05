import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSeller } from "@/lib/seller-gate"

export const dynamic = "force-dynamic"

/**
 * Creates a new draft for the authenticated seller. Deliberately gated on
 * requireSeller (not requireApprovedSeller): a pending seller may prepare
 * drafts freely; the approval requirement is enforced only when publishing.
 */
export async function POST(request: Request) {
  try {
    const result = await requireSeller(request)
    if (result.error) return result.error
    const seller = result.seller

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

/**
 * Lists the authenticated seller's draft listings, most recently updated
 * first. Used to surface "resume draft" entries on the seller dashboard.
 */
export async function GET(request: Request) {
  try {
    const result = await requireSeller(request)
    if (result.error) return result.error
    const seller = result.seller

    const drafts = await prisma.listing.findMany({
      where: { sellerId: seller.id, status: "DRAFT" },
      orderBy: { updatedAt: "desc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    return NextResponse.json({
      drafts: drafts.map((d) => ({
        id: d.id,
        title: d.title || "",
        description: d.description || "",
        price: d.price ? Number(d.price) : null,
        categoryId: d.categoryId,
        category: d.category,
        images: d.images,
        draftStep: d.draftStep || 1,
        updatedAt: d.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("List drafts error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
