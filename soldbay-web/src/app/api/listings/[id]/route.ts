import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    if (!listing) {
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
