import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signMobileToken } from "@/lib/sign-mobile-token"

/**
 * Mobile / React Native login.
 * Returns a plain JWT (not a cookie session) for Authorization: Bearer use.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Same error for missing user, null password, or bad password (no email enumeration)
    if (!user?.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const token = signMobileToken({
      userId: user.id,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Mobile login error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
