import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

async function getAuthenticatedSellerId(request: Request): Promise<{ sellerId?: string; error?: NextResponse }> {
  const bearer = extractBearerToken(request.headers.get("authorization"))
  let userId: string | null = null

  if (bearer) {
    const mobileUser = await verifyMobileToken(bearer)
    if (!mobileUser || mobileUser.role !== "SELLER") {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    }
    userId = mobileUser.userId
  } else {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "SELLER") {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    }
    userId = session.user.id
  }

  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  const seller = await prisma.sellerProfile.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!seller) {
    return { error: NextResponse.json({ error: "Seller profile not found." }, { status: 404 }) }
  }

  return { sellerId: seller.id }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await getAuthenticatedSellerId(request)
    if (authResult.error || !authResult.sellerId) return authResult.error!

    const draft = await prisma.listing.findFirst({
      where: {
        id,
        sellerId: authResult.sellerId,
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
    const authResult = await getAuthenticatedSellerId(request)
    if (authResult.error || !authResult.sellerId) return authResult.error!

    const body = await request.json()

    const existing = await prisma.listing.findFirst({
      where: {
        id,
        sellerId: authResult.sellerId,
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
    const authResult = await getAuthenticatedSellerId(request)
    if (authResult.error || !authResult.sellerId) return authResult.error!

    const existing = await prisma.listing.findFirst({
      where: {
        id,
        sellerId: authResult.sellerId,
        status: "DRAFT",
      },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 })
    }

    await prisma.listing.delete({ where: { id } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Delete draft error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
