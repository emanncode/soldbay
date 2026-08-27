import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const listing = await prisma.listing.findUnique({
      where: { id },
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

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { seller: { select: { userId: true } } },
    })

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 },
      )
    }

    if (listing.seller.userId !== userId) {
      return NextResponse.json(
        { error: "You can only delete your own listings." },
        { status: 403 },
      )
    }

    await prisma.listing.delete({ where: { id } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Delete listing error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
