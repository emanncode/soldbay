import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
])

export async function POST(request: Request) {
  try {
    // --- Authenticate ---
    const bearer = extractBearerToken(request.headers.get("authorization"))
    let userId: string | null = null

    if (bearer) {
      const mobileUser = await verifyMobileToken(bearer)
      if (!mobileUser || mobileUser.role !== "SELLER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = mobileUser.userId
    } else {
      const session = await auth()
      if (!session?.user?.id || session.user.role !== "SELLER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = session.user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // --- Find seller profile & user ---
    const profile = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: { user: true },
    })
    if (!profile) {
      return NextResponse.json(
        { error: "Seller profile not found." },
        { status: 404 },
      )
    }

    if (!profile.user.universityId) {
      return NextResponse.json(
        { error: "Please select your university before submitting student portal verification." },
        { status: 400 },
      )
    }

    // --- Parse multipart form ---
    const formData = await request.formData()
    const file = formData.get("image") as File | null

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Please upload a screenshot of your student portal home page." },
        { status: 400 },
      )
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "File must be a JPEG, PNG, WebP, or HEIC screenshot/image." },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Screenshot must be under 5 MB." },
        { status: 400 },
      )
    }

    // --- Upload to Vercel Blob ---
    const ext = file.type.split("/")[1] ?? "jpg"
    const blobPath = `seller-portals/${profile.id}-${Date.now()}.${ext}`

    const blob = await put(blobPath, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // --- Store URL (do NOT set verifiedAt) ---
    await prisma.sellerProfile.update({
      where: { id: profile.id },
      data: { idImageUrl: blob.url },
    })

    return NextResponse.json({ ok: true, idImageUrl: blob.url })
  } catch (error) {
    console.error("Verify seller error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
