import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateListingCompleteness } from "@/lib/listing-validation"
import { requireApprovedSeller } from "@/lib/seller-gate"

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")
    const search = searchParams.get("search")?.trim() ?? ""
    const cursor = searchParams.get("cursor")
    const parsedLimit = Number(searchParams.get("limit"))
    const limit =
      Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, MAX_LIMIT)
        : DEFAULT_LIMIT

    const where: Record<string, unknown> = {
      status: "ACTIVE",
      // Exclude listings owned by soft-deleted (retention) accounts from
      // public browse/search. The listing data is retained; it just stops
      // being surfaced to buyers.
      seller: { user: { deletedAt: null } },
    }
    if (categorySlug) {
      where.category = { slug: categorySlug }
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const items = await prisma.listing.findMany({
      where,
      include: {
        seller: {
          select: { username: true, businessName: true },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    })

    const hasMore = items.length > limit
    const pageItems = hasMore ? items.slice(0, limit) : items
    const nextCursor = hasMore ? pageItems[pageItems.length - 1].id : null

    return NextResponse.json({ items: pageItems, nextCursor, hasMore })
  } catch (error) {
    console.error("List listings error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Bind the listing to the AUTHENTICATED seller, never a client-supplied
    // sellerId. Trusting body.sellerId let any authenticated seller create
    // listings under another seller's profile. requireApprovedSeller re-checks
    // the token against the DB (so a deleted/expired token is rejected early)
    // and enforces admin APPROVED status.
    const auth = await requireApprovedSeller(request)
    if (auth.error) return auth.error

    const body = await request.json()

    const validation = validateListingCompleteness(body)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const seller = auth.seller
    if (!seller.user.universityId) {
      return NextResponse.json(
        { error: "Seller must be associated with a university before creating listings." },
        { status: 403 },
      )
    }

    const categoryWhere = body.categoryId
      ? { id: body.categoryId }
      : { slug: body.categorySlug }
    const category = await prisma.category.findUnique({
      where: categoryWhere,
    })
    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 })
    }

    const listing = await prisma.listing.create({
      data: {
        sellerId: seller.id,
        categoryId: category.id,
        title: body.title.trim(),
        description: body.description.trim(),
        price: Number(body.price),
        images: body.images ?? [],
        stock: body.stock ?? 1,
      },
    })

    return NextResponse.json({ id: listing.id }, { status: 201 })
  } catch (error) {
    console.error("Create listing error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
