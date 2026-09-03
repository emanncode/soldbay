import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { serverErrorResponse } from "@/lib/api-error"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const otp = typeof body.otp === "string" ? body.otp.trim() : ""
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : ""

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, verification code, and new password are required." },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      )
    }

    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
        expires: { gt: new Date() },
      },
    })

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: email },
      }),
    ])

    return NextResponse.json({ ok: true, message: "Password has been successfully updated." })
  } catch (error) {
    console.error("Reset password error:", error)
    return serverErrorResponse()
  }
}
