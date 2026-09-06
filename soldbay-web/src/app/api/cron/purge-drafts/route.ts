import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/**
 * Window after which an abandoned draft listing is considered stale and is
 * purged. A draft is a Listing row with status "DRAFT"; the clock starts from
 * its last update so sellers who keep editing are never touched.
 */
export const DRAFT_EXPIRY_DAYS = 30

/**
 * Scheduled job (Vercel Cron) that purges abandoned draft listings so the
 * products screen, dashboard queries, and storage don't accumulate stale
 * half-finished rows. Must be called with the CRON secret to prevent public
 * invocation (same guard as /api/cron/purge-accounts).
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

    const stale = await prisma.listing.findMany({
      where: {
        status: "DRAFT",
        updatedAt: { lt: cutoff },
      },
      select: { id: true },
      take: 500,
    })

    if (stale.length === 0) {
      return NextResponse.json({ ok: true, purged: 0, cutoff: cutoff.toISOString() })
    }

    const ids = stale.map((l) => l.id)

    await prisma.$transaction(
      async (tx) => {
        // Drafts cannot be purchased, but delete any orphaned order references
        // first so a Restrict FK on Listing never blocks the purge.
        await tx.order.deleteMany({ where: { listingId: { in: ids } } })
        await tx.listing.deleteMany({ where: { id: { in: ids } } })
      },
      { timeout: 30000, maxWait: 15000 },
    )

    return NextResponse.json({
      ok: true,
      purged: ids.length,
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