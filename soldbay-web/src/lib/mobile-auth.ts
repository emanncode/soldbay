import { jwtVerify } from "jose"
import type { UserRole } from "@/generated/prisma/enums"

export type MobileJwtPayload = {
  userId: string
  role: UserRole
}

/**
 * Verify a mobile access token (Edge + Node safe).
 * Tokens are signed with jsonwebtoken (HS256) using AUTH_SECRET — same secret NextAuth uses.
 * Uses jose for verification so this module can be imported from Edge middleware
 * (jsonwebtoken is Node-only and cannot be bundled into middleware).
 */
export async function verifyMobileToken(
  token: string,
): Promise<MobileJwtPayload | null> {
  try {
    const secret = process.env.AUTH_SECRET
    if (!secret) return null

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))

    const userId = payload.userId
    const role = payload.role

    if (typeof userId !== "string" || typeof role !== "string") {
      return null
    }

    return { userId, role: role as UserRole }
  } catch {
    return null
  }
}

/** Extract Bearer token from Authorization header, if present. */
export function extractBearerToken(authorization: string | null): string | null {
  if (!authorization) return null
  const [scheme, token] = authorization.split(" ")
  if (scheme?.toLowerCase() !== "bearer" || !token) return null
  return token
}
