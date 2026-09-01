import { verifyMobileToken, type MobileJwtPayload } from "@/lib/mobile-auth"
import { prisma } from "@/lib/prisma"

/**
 * Verify a mobile access token AND confirm the account is still active.
 *
 * `verifyMobileToken` (in mobile-auth.ts) only validates the JWT signature,
 * so a token minted before an account was soft-deleted (retention model)
 * would remain valid until it expires (currently ~30 days). This variant
 * additionally checks the database to ensure the user still exists and has
 * NOT been soft-deleted, closing that gap for API request authentication.
 *
 * Node runtime only — must not be imported from Edge middleware.
 *
 * @returns the JWT payload if the token is valid AND the user is active,
 *          otherwise null.
 */
export async function verifyActiveMobileToken(
  token: string,
): Promise<MobileJwtPayload | null> {
  const payload = await verifyMobileToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { deletedAt: true },
  })

  if (!user || user.deletedAt) return null

  return payload
}
