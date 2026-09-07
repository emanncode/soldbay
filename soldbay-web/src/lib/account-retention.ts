import { prisma } from "@/lib/prisma"
import { deleteBlobImages } from "@/lib/blob-image"

/**
 * Provisional retention window for soft-deleted accounts. The 5-year figure
 * is a working assumption pending a final data-retention policy decision.
 * This is the single source of truth for the window; change it here and the
 * DELETE endpoint (which stamps `retainUntil`) stays in sync automatically.
 */
export const ACCOUNT_RETENTION_YEARS = 5

export function computeRetainUntil(from: Date = new Date()): Date {
  const retainUntil = new Date(from)
  retainUntil.setFullYear(retainUntil.getFullYear() + ACCOUNT_RETENTION_YEARS)
  return retainUntil
}

/**
 * Purges/anonymizes soft-deleted accounts whose retention window has elapsed.
 * Only accounts with `deletedAt` set AND `retainUntil` in the past are touched.
 * This runs from the scheduled purge job; it never acts on live accounts.
 *
 * Besides sessions/accounts and user PII, the purge also removes a purged
 * user's seller listings (and their blob images) so no orphaned product data
 * or stored objects survive the account's retention window.
 *
 * The job drains the full backlog page by page so it stays correct even when
 * far more expired accounts exist than fit in one batch.
 *
 * @returns the number of accounts purged.
 */
export async function purgeExpiredAccounts(batchSize = 200): Promise<number> {
  const now = new Date()
  let purged = 0

  while (true) {
    const expired = await prisma.user.findMany({
      where: {
        deletedAt: { not: null },
        retainUntil: { not: null, lt: now },
      },
      select: { id: true },
      orderBy: { id: "asc" },
      take: batchSize,
      skip: purged,
    })

    if (expired.length === 0) break

    const ids = expired.map((u) => u.id)

    // Pull the purged sellers' listings (images for blob cleanup, ids for
    // deleting rows that otherwise outlive the account — audit item 8b).
    const listings = await prisma.listing.findMany({
      where: { seller: { userId: { in: ids } } },
      select: { id: true, images: true },
    })
    const listingIds = listings.map((l) => l.id)
    const images = listings.flatMap((l) => l.images)

    await prisma.$transaction(
      async (tx) => {
        // A Restrict FK from Order to Listing would block deletes, so clear
        // any order references to the purged sellers' listings first.
        if (listingIds.length > 0) {
          await tx.order.deleteMany({ where: { listingId: { in: listingIds } } })
          await tx.listing.deleteMany({ where: { id: { in: listingIds } } })
        }
        await tx.session.deleteMany({ where: { userId: { in: ids } } })
        await tx.account.deleteMany({ where: { userId: { in: ids } } })
        // Anonymize PII once the retention window has passed so the original
        // email/matric can be reused and no traceable personal data remains.
        // `previousEmail` (the original address stashed on soft-delete) is also
        // cleared — it is PII too and the row's placeholder email is already set.
        for (const id of ids) {
          await tx.user.update({
            where: { id },
            data: {
              previousEmail: null,
              email: `deleted+${id}@deleted.soldbay.app`,
              password: null,
              matricNumber: null,
              name: "Deleted Account",
              phone: null,
            },
          })
        }
      },
      { timeout: 30000, maxWait: 15000 },
    )

    // Best-effort cleanup of the removed listings' blob objects. Runs after
    // the transaction so a blob failure never rolls back the purge itself.
    await deleteBlobImages(images)

    purged += expired.length
    if (expired.length < batchSize) break
  }

  return purged
}
