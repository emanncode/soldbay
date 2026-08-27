import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const otp = typeof body.otp === "string" ? body.otp.trim() : ""

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and 6-digit code are required." }, { status: 400 })
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
        { error: "Invalid or expired verification code. Please request a new one." },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, valid: true })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json(
      { error: "Something went wrong verifying code." },
      { status: 500 }
    )
  }
}
