import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Role, SellFrequency } from "@/generated/prisma/enums"

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
