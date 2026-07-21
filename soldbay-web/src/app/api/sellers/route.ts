import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@/generated/prisma/enums"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 })
    }
    if (!body.email || typeof body.email !== "string" || !body.email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }
    if (!body.universityId || typeof body.universityId !== "string") {
      return NextResponse.json({ error: "University ID is required." }, { status: 400 })
    }

    const university = await prisma.university.findUnique({ where: { id: body.universityId } })
    if (!university) {
      return NextResponse.json({ error: "University not found." }, { status: 404 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: body.email.trim().toLowerCase(),
          name: body.name.trim(),
          phone: body.phone || null,
          role: UserRole.SELLER,
          universityId: body.universityId,
          level: body.level || null,
        },
      })

      const profile = await tx.sellerProfile.create({
        data: {
          userId: user.id,
          businessName: body.businessName || null,
          bio: body.bio || null,
        },
      })

      return { user, profile }
    })

    return NextResponse.json(
      { id: result.user.id, profileId: result.profile.id },
      { status: 201 },
    )
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 },
      )
    }

    console.error("Create seller error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
