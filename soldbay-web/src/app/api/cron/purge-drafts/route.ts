import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteBlobImages } from "@/lib/blob-image"

export const dynamic = "force-dynamic"

/**
 * Window after which an abandoned draft listing is considered stale and is
 * purged. A draft is a Listing row with status "DRAFT"; the clock starts from
 * its last update so sellers who keep editing are never touched.
 */
export const DRAFT_EXPIRY_DAYS = 30

/**
 * Number of rows to process per pass. The job loops over the full result set
 * page by page so it backlogs correctly even when far more drafts exceed the
 * expiry window than fit in a single batch.
 */
export const PURGE_BATCH_SIZE = 500

/**
 * Scheduled job (Vercel Cron) that purges abandoned draft listings so the
 * products screen, dashboard queries, and storage don't accumulate stale
 * half-finished rows. Must be called with the CRON secret to prevent public
 * invocation (same guard as /api/cron/purge-accounts).
 *
 * Two correctness guarantees the original job was missing:
 *  - Drafts whose seller is still awaiting verification approval are left
 *    alone. A pending seller may deliberately be shaping a first draft while
 *    the admin decides; auto-purge would silently destroy their work.
 *  - Each purged draft's image URLs are read and passed to `deleteBlobImages`,
 *    so the stored blob objects are cleaned up alongside the row instead of
 *    leaking permanently in Vercel Blob storage.
 */
export async function GET(request: Request) {
  if (
    process.env.CRON_SECRET &&
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cutoff = new Date(Date.now() - DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    let purged = 0
    let cursor = 0

    // Loop so we drain the whole backlog, not just a single page.
    while (true) {
      const stale = await prisma.listing.findMany({
        where: {
          status: "DRAFT",
          updatedAt: { lt: cutoff },
          // Never touch a pending seller's half-built draft (audit item 8c).
          seller: { verificationStatus: { not: "PENDING" } },
        },
        select: { id: true, images: true },
        orderBy: { id: "asc" },
        take: PURGE_BATCH_SIZE,
        skip: cursor,
      })

      if (stale.length === 0) break

      const ids = stale.map((l) => l.id)
      const images = stale.flatMap((l) => l.images)

      await prisma.$transaction(
        async (tx) => {
          // Drafts cannot be purchased, but delete any orphaned order references
          // first so a Restrict FK on Listing never blocks the purge.
          await tx.order.deleteMany({ where: { listingId: { in: ids } } })
          await tx.listing.deleteMany({ where: { id: { in: ids } } })
        },
        { timeout: 30000, maxWait: 15000 },
      )

      // Clean up the blob objects referenced by the purged drafts. Skip-based
      // paging stays correct because the rows just fetched were deleted in the
      // transaction, so the next window starts at the next remaining row.
      await deleteBlobImages(images)

      purged += ids.length
      cursor += stale.length

      if (stale.length < PURGE_BATCH_SIZE) break
    }

    return NextResponse.json({
      ok: true,
      purged,
      cutoff: cutoff.toISOString(),
    })
  } catch (error) {
    console.error("Purge drafts cron error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}