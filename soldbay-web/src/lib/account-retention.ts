import { prisma } from "@/lib/prisma"

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
 * @returns the number of accounts purged.
 */
export async function purgeExpiredAccounts(batchSize = 200): Promise<number> {
  const now = new Date()

  const expired = await prisma.user.findMany({
    where: {
      deletedAt: { not: null },
      retainUntil: { not: null, lt: now },
    },
    select: { id: true },
    take: batchSize,
  })

  if (expired.length === 0) return 0

  const ids = expired.map((u) => u.id)

  await prisma.$transaction(
    async (tx) => {
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

  return ids.length
}
