import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

/**
 * Serves a seller's sensitive student ID / portal screenshot.
 *
 * The image is stored as a PRIVATE Vercel Blob and is never publicly reachable.
 * Access rules:
 *  - A seller may fetch their own profile image (default).
 *  - An administrator may fetch any profile's image by passing `?profileId=...`
 *    (used by the verification review flow).
 * This endpoint performs the authorization check and streams the blob back
 * without ever exposing a public URL.
 */
export async function GET(request: Request) {
  try {
    let userId: string | null = null
    let role: string | null = null
    const bearer = extractBearerToken(request.headers.get("authorization"))

    if (bearer) {
      const mobileUser = await verifyMobileToken(bearer)
      if (!mobileUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = mobileUser.userId
      role = mobileUser.role
    } else {
      const session = await auth()
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = session.user.id
      role = session.user.role ? String(session.user.role) : null
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const targetProfileId = url.searchParams.get("profileId")

    // Resolve which profile's image to serve.
    const profileId = targetProfileId
    if (targetProfileId) {
      // Only admins may request another seller's image.
      if (role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    } else {
      // Default: the caller's own profile.
      const own = await prisma.sellerProfile.findUnique({
        where: { userId },
        select: { id: true, idImageUrl: true, userId: true },
      })
      if (!own || !own.idImageUrl) {
        return NextResponse.json({ error: "No verification image on file." }, { status: 404 })
      }
      return streamImage(own.idImageUrl)
    }

    if (!profileId) {
      return NextResponse.json({ error: "Not found." }, { status: 404 })
    }

    const profile = await prisma.sellerProfile.findUnique({
      where: { id: profileId },
      select: { idImageUrl: true },
    })
    if (!profile || !profile.idImageUrl) {
      return NextResponse.json({ error: "No verification image on file." }, { status: 404 })
    }
    return streamImage(profile.idImageUrl)
  } catch (error) {
    console.error("Serve seller ID image error:", error)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}

async function streamImage(idImageUrl: string) {
  // Local dev fallback (no Blob token configured) has no real image.
  if (idImageUrl.includes("mock-storage.soldbay.local")) {
    return NextResponse.json(
      { error: "Verification image is only available when Blob storage is configured." },
      { status: 404 }
    )
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: "Image storage is not configured." },
      { status: 503 }
    )
  }

  const result = await get(idImageUrl, {
    access: "private",
    token,
  })
  if (!result) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 })
  }

  const contentType =
    result.headers?.get("content-type") || "application/octet-stream"

  return new NextResponse(result.stream as unknown as BodyInit, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store",
      "Content-Disposition": "inline",
    },
  })
}
