import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteBlobImages } from "@/lib/blob-image"
import { requireApprovedSeller } from "@/lib/seller-gate"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await requireApprovedSeller(request)
    if (result.error) return result.error
    const seller = result.seller

    const draft = await prisma.listing.findFirst({
      where: {
        id,
        sellerId: seller.id,
        status: "DRAFT",
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 })
    }

    return NextResponse.json({
      id: draft.id,
      title: draft.title || "",
      description: draft.description || "",
      price: draft.price ? Number(draft.price) : null,
      categoryId: draft.categoryId,
      category: draft.category,
      images: draft.images,
      draftStep: draft.draftStep || 1,
      updatedAt: draft.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error("Get draft error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await requireApprovedSeller(request)
    if (result.error) return result.error
    const seller = result.seller

    const body = await request.json()

    const existing = await prisma.listing.findFirst({
      where: {
        id,
        sellerId: seller.id,
        status: "DRAFT",
      },
    })

    if (!existing) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 })
    }

    let categoryId = body.categoryId
    if (!categoryId && body.categorySlug) {
      const cat = await prisma.category.findUnique({
        where: { slug: body.categorySlug },
      })
      if (cat) categoryId = cat.id
    }

    // If the caller is replacing the image set, clean up the blobs that are no
    // longer referenced so they don't get orphaned in Blob storage.
    let imagesToRemove: string[] = []
    if (Array.isArray(body.images)) {
      imagesToRemove = (existing.images || []).filter((img) => !body.images.includes(img))
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title ? String(body.title).trim() : null } : {}),
        ...(body.description !== undefined ? { description: body.description ? String(body.description).trim() : null } : {}),
        ...(body.price !== undefined ? { price: body.price != null && !isNaN(Number(body.price)) ? Number(body.price) : null } : {}),
        ...(categoryId !== undefined ? { categoryId: categoryId || null } : {}),
        ...(Array.isArray(body.images) ? { images: body.images } : {}),
        ...(body.draftStep !== undefined ? { draftStep: Number(body.draftStep) || 1 } : {}),
      },
      select: {
        id: true,
        title: true,
        draftStep: true,
        updatedAt: true,
      },
    })

    // Best-effort: remove images that are no longer part of the draft.
    if (imagesToRemove.length > 0) {
      void deleteBlobImages(imagesToRemove)
    }

    return NextResponse.json({
      ok: true,
      id: updated.id,
      draftStep: updated.draftStep,
      updatedAt: updated.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error("Patch draft error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await requireApprovedSeller(request)
    if (result.error) return result.error
    const seller = result.seller

    const existing = await prisma.listing.findFirst({
      where: {
        id,
        sellerId: seller.id,
        status: "DRAFT",
      },
      select: { id: true, images: true },
    })

    if (!existing) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 })
    }

    await prisma.listing.delete({ where: { id } })

    // Clean up the images that belonged to the discarded draft.
    if (existing.images.length > 0) {
      void deleteBlobImages(existing.images)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Delete draft error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
