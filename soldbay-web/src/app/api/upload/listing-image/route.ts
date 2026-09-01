import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { extractBearerToken } from "@/lib/mobile-auth"
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active"
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
      const mobileUser = await verifyActiveMobileToken(bearer)
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

    // --- Parse multipart form ---
    const formData = await request.formData()
    const file = formData.get("image") as File | null

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Please upload an image." },
        { status: 400 },
      )
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "File must be a JPEG, PNG, WebP, or HEIC image." },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be under 5 MB." },
        { status: 400 },
      )
    }

    // --- Upload to Vercel Blob ---
    const ext = file.type.split("/")[1] ?? "jpg"
    const blobPath = `listing-images/${userId}-${Date.now()}.${ext}`

    const blob = await put(blobPath, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload listing image error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
