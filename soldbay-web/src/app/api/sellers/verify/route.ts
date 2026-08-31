import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { prisma } from "@/lib/prisma"
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_VERIFICATION_ATTEMPTS = 3
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

    // Enforce the resubmission cap: a seller whose verification was rejected three
    // times must contact support to be reviewed again (admin resets attempts).
    if (
      profile.verificationStatus === "REJECTED" &&
      profile.verificationAttempts >= MAX_VERIFICATION_ATTEMPTS
    ) {
      return NextResponse.json(
        {
          error:
            "You have reached the maximum number of verification attempts. Please contact support for further review.",
          requiresSupport: true,
        },
        { status: 403 },
      )
    }

    // --- Parse multipart form ---
    const formData = await request.formData()
    const file = formData.get("image") as File | null
    const matricNumberRaw = formData.get("matricNumber")
    const matricNumber = typeof matricNumberRaw === "string" ? matricNumberRaw.trim().toUpperCase() : null

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Please upload a screenshot of your student portal home page or ID card." },
        { status: 400 },
      )
    }

    if (matricNumber) {
      const existingUserWithMatric = await prisma.user.findFirst({
        where: {
          matricNumber,
          id: { not: userId },
        },
      })
      if (existingUserWithMatric) {
        return NextResponse.json(
          { error: "This matriculation number has already been registered on Soldbay." },
          { status: 400 },
        )
      }
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

    let blobUrl: string
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(blobPath, file, {
        // PRIVATE: student ID / portal screenshots are sensitive PII and must
        // not be publicly reachable. They are served only through the
        // authenticated GET /api/sellers/me/id-image endpoint.
        access: "private",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      blobUrl = blob.url
    } else {
      // Fallback dev data URL when running locally without Blob token
      blobUrl = `https://mock-storage.soldbay.local/${blobPath}`
    }

    // --- Store URL, matricNumber, and reset verification state atomically ---
    await prisma.$transaction([
      prisma.sellerProfile.update({
        where: { id: profile.id },
        data: {
          idImageUrl: blobUrl,
          verificationStatus: "PENDING",
          rejectionReason: null,
          verificationAttempts: { increment: 1 },
        },
      }),
      ...(matricNumber
        ? [
            prisma.user.update({
              where: { id: userId },
              data: { matricNumber },
            }),
          ]
        : []),
    ])

    return NextResponse.json({ ok: true, idImageUrl: blobUrl, matricNumber })
  } catch (error) {
    console.error("Verify seller error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
