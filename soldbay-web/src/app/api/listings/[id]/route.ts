import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteBlobImages } from "@/lib/blob-image"
import { requireApprovedSeller } from "@/lib/seller-gate"
import { OrderStatus } from "@/generated/prisma/client"

export const dynamic = "force-dynamic"

// Order states that are still "in flight". While any of these exist for a
// listing, editing the listing's core details (which a placed order may
// reference) or reducing its stock would corrupt an in-progress transaction.
const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.PAYMENT_SECURED,
  OrderStatus.PICKUP_ARRANGED,
  OrderStatus.AWAITING_CONFIRMATION,
  OrderStatus.DISPUTED,
]

async function getAuthenticatedApprovedSellerId(
  request: Request,
): Promise<{ sellerId?: string; error?: NextResponse }> {
  const result = await requireApprovedSeller(request)
  if (result.error) return { error: result.error }
  return { sellerId: result.seller.id }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const listing = await prisma.listing.findFirst({
      where: {
        id,
        // Hide listings owned by soft-deleted (retention) accounts from the
        // public detail view. Data is retained; it just isn't surfaced.
        seller: { user: { deletedAt: null } },
      },
      include: {
        seller: {
          select: {
            username: true,
            businessName: true,
            user: {
              select: {
                name: true,
                university: {
                  select: { name: true, code: true },
                },
              },
            },
          },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
    })

    if (!listing || listing.status === "DRAFT") {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 },
      )
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("Get listing error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const authResult = await getAuthenticatedApprovedSellerId(request)
    if (authResult.error || !authResult.sellerId) return authResult.error!

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { sellerId: true, seller: { select: { userId: true } }, images: true },
    })

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 },
      )
    }

    if (listing.sellerId !== authResult.sellerId) {
      return NextResponse.json(
        { error: "You can only delete your own listings." },
        { status: 403 },
      )
    }

    await prisma.listing.delete({ where: { id } })

    // Clean up the cover/listing images that are no longer referenced.
    if (listing.images.length > 0) {
      void deleteBlobImages(listing.images)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Delete listing error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

/**
 * Edits a published (ACTIVE) listing owned by the caller. Only the mutable
 * surface fields are accepted: title, description, price, images, category and
 * stock. Editing is rejected while the listing has any in-flight order so
 * changes can't corrupt a transaction that's already underway.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const authResult = await getAuthenticatedApprovedSellerId(request)
    if (authResult.error || !authResult.sellerId) return authResult.error!

    const body = await request.json()

    const listing = await prisma.listing.findFirst({
      where: { id, sellerId: authResult.sellerId, status: "ACTIVE" },
      select: { id: true, images: true },
    })

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found or not owned by you." },
        { status: 404 },
      )
    }

    const inFlight = await prisma.order.count({
      where: { listingId: id, status: { in: ACTIVE_ORDER_STATUSES } },
    })

    if (inFlight > 0) {
      return NextResponse.json(
        {
          error:
            "This listing has orders in progress. Wait for them to complete before editing.",
        },
        { status: 409 },
      )
    }

    let categoryId: string | null | undefined = undefined
    if (body.categorySlug !== undefined) {
      if (body.categorySlug) {
        const cat = await prisma.category.findUnique({
          where: { slug: body.categorySlug },
        })
        if (!cat) {
          return NextResponse.json({ error: "Category not found." }, { status: 400 })
        }
        categoryId = cat.id
      } else {
        categoryId = null
      }
    }

    let stock: number | undefined = undefined
    if (body.stock !== undefined) {
      if (!Number.isInteger(Number(body.stock)) || Number(body.stock) < 0) {
        return NextResponse.json({ error: "Stock must be a non-negative integer." }, { status: 400 })
      }
      stock = Number(body.stock)
    }

    let imagesToRemove: string[] = []
    if (Array.isArray(body.images)) {
      imagesToRemove = (listing.images || []).filter((img) => !body.images.includes(img))
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title ? String(body.title).trim() : null } : {}),
        ...(body.description !== undefined ? { description: body.description ? String(body.description).trim() : null } : {}),
        ...(body.price !== undefined
          ? { price: body.price != null && !isNaN(Number(body.price)) && Number(body.price) > 0 ? Number(body.price) : null }
          : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
        ...(Array.isArray(body.images) ? { images: body.images } : {}),
        ...(stock !== undefined ? { stock } : {}),
      },
      select: { id: true, title: true, price: true, status: true },
    })

    // Best-effort: remove images no longer referenced by the listing.
    if (imagesToRemove.length > 0) {
      void deleteBlobImages(imagesToRemove)
    }

    return NextResponse.json({
      ok: true,
      id: updated.id,
      title: updated.title,
      price: updated.price !== null && updated.price !== undefined ? Number(updated.price) : null,
      status: updated.status,
    })
  } catch (error) {
    console.error("Update listing error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
