import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(universities)
  } catch (error) {
    console.error("Failed to fetch universities:", error)
    return NextResponse.json(
      { error: "Failed to fetch universities." },
      { status: 500 },
    )
  }
}