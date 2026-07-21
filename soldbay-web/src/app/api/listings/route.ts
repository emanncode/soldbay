import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")

    const where: Record<string, unknown> = { status: "ACTIVE" }
    if (categorySlug) {
      where.category = { slug: categorySlug }
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        seller: {
          select: { businessName: true },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(listings)
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
    const body = await request.json()

    if (!body.sellerId || typeof body.sellerId !== "string") {
      return NextResponse.json({ error: "Seller ID is required." }, { status: 400 })
    }
    if (body.categoryId && typeof body.categoryId !== "string") {
      return NextResponse.json({ error: "Invalid category ID." }, { status: 400 })
    }
    if (body.categorySlug && typeof body.categorySlug !== "string") {
      return NextResponse.json({ error: "Invalid category slug." }, { status: 400 })
    }
    if (!body.categoryId && !body.categorySlug) {
      return NextResponse.json({ error: "Category ID or slug is required." }, { status: 400 })
    }
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 })
    }
    if (!body.description || typeof body.description !== "string" || !body.description.trim()) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 })
    }
    if (body.price == null || isNaN(Number(body.price)) || Number(body.price) <= 0) {
      return NextResponse.json({ error: "Price must be a positive number." }, { status: 400 })
    }
    if (body.stock != null && (typeof body.stock !== "number" || body.stock < 1)) {
      return NextResponse.json({ error: "Stock must be at least 1." }, { status: 400 })
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { id: body.sellerId },
    })
    if (!seller) {
      return NextResponse.json({ error: "Seller profile not found." }, { status: 404 })
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
        sellerId: body.sellerId,
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
