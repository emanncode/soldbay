import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Role, SellFrequency } from "@/generated/prisma/enums"
import { Resend } from "resend"
import { generateWaitlistEmailHtml } from "@/emails/WaitlistWelcomeEmail"

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy")
function toRole(value: string): Role | null {
  if (value === "buyer") return Role.BUYER
  if (value === "seller") return Role.SELLER
  return null
}

function toSellFrequency(value: string): SellFrequency | null {
  const map: Record<string, SellFrequency> = {
    daily: SellFrequency.DAILY,
    weekly: SellFrequency.WEEKLY,
    occasionally: SellFrequency.OCCASIONALLY,
  }
  return map[value.toLowerCase()] ?? null
}

const WAITLIST_INBOX = process.env.WAITLIST_INBOX?.trim() || process.env.QUESTIONS_INBOX?.trim() || "olajubajeifeoluwa93@gmail.com"

async function forwardWaitlistEmail(data: Record<string, unknown>) {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(WAITLIST_INBOX)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `New Soldbay Waitlist: ${data.role} - ${data.name}`,
        ...data,
        _template: "table"
      }),
    })
    return res.ok
  } catch (error) {
    console.error("Waitlist email error:", error)
    return false
  }
}

/** Public waitlist size for social-proof UI (no PII). */
export async function GET() {
  try {
    const count = await prisma.waitlistSignup.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Waitlist count error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const role = toRole(body.role)
    if (!role) {
      return NextResponse.json(
        { error: "Invalid or missing role. Must be 'buyer' or 'seller'." },
        { status: 400 },
      )
    }

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 },
      )
    }

    if (!body.email || typeof body.email !== "string" || !body.email.trim()) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      )
    }

    if (!body.university || typeof body.university !== "string" || !body.university.trim()) {
      return NextResponse.json(
        { error: "University is required." },
        { status: 400 },
      )
    }

    const data: Record<string, unknown> = {
      role,
      name: body.name.trim(),
      email: body.email.trim(),
      university: body.university.trim(),
      categories: body.categories ?? [],
      pollAnswers: body.pollAnswers ?? [],
    }

    if (role === Role.BUYER) {
      data.level = body.level ?? null
    } else {
      data.sellsWhat = body.sellsWhat ?? null
      data.frequency = body.frequency ? toSellFrequency(body.frequency) : null
    }

    const created = await prisma.waitlistSignup.create({ data: data as never })

    const emailSent = await forwardWaitlistEmail(data)

    if (!emailSent) {
      console.error("Waitlist saved but email forward failed for:", data.email)
    }

    // Send Auto-Responder to User
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Soldbay <hello@soldbay.shop>",
          to: data.email as string,
          subject: "You're on the Soldbay waitlist! 🎉",
          html: generateWaitlistEmailHtml(data as any),
        })
      } catch (error) {
        console.error("Failed to send welcome email to user:", error)
      }
    }

    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 },
      )
    }

    console.error("Waitlist signup error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
