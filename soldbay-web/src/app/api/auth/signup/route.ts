import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@/generated/prisma/enums"

const VALID_ROLES = new Set<string>([UserRole.BUYER, UserRole.SELLER])

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.email || typeof body.email !== "string" || !body.email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }
    if (!body.password || typeof body.password !== "string" || body.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      )
    }
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 })
    }
    if (!body.role || typeof body.role !== "string" || !VALID_ROLES.has(body.role)) {
      return NextResponse.json(
        { error: "Role must be BUYER or SELLER." },
        { status: 400 },
      )
    }
    if (!body.universityId || typeof body.universityId !== "string") {
      return NextResponse.json({ error: "University ID is required." }, { status: 400 })
    }

    const university = await prisma.university.findUnique({
      where: { id: body.universityId },
    })
    if (!university) {
      return NextResponse.json({ error: "University not found." }, { status: 404 })
    }

    const email = body.email.trim().toLowerCase()
    const hashedPassword = await bcrypt.hash(body.password, 12)
    const role = body.role as UserRole

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: body.name.trim(),
          phone: typeof body.phone === "string" ? body.phone : null,
          role,
          universityId: body.universityId,
          level: typeof body.level === "string" ? body.level : null,
        },
      })

      let profileId: string | undefined
      if (role === UserRole.SELLER) {
        const profile = await tx.sellerProfile.create({
          data: {
            userId: user.id,
            businessName:
              typeof body.businessName === "string" ? body.businessName : null,
            bio: typeof body.bio === "string" ? body.bio : null,
          },
        })
        profileId = profile.id
      }

      return { user, profileId }
    })

    return NextResponse.json(
      {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        ...(result.profileId ? { profileId: result.profileId } : {}),
      },
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

    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
