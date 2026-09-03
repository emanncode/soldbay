import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serverErrorResponse } from "@/lib/api-error"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Security: avoid revealing user existence
    if (!user) {
      return NextResponse.json({ ok: true, message: "If this email is registered, a reset code was sent." })
    }

    // Generate 6-digit OTP code (e.g. 849201)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Store in VerificationToken (upsert)
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email,
          token: otp,
        },
      },
      create: {
        identifier: email,
        token: otp,
        expires,
      },
      update: {
        expires,
      },
    })

    // When running without a live email domain, we log the OTP to server console and return dev preview in development
    console.log(`[Soldbay Auth] Password Reset OTP for ${email}: ${otp}`)

    return NextResponse.json({
      ok: true,
      message: "If this email is registered, a reset code was sent.",
      // Development/testing helper: include devOtp when running in dev/test mode
      ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return serverErrorResponse()
  }
}
