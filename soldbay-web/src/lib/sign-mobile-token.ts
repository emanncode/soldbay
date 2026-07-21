import jwt from "jsonwebtoken"
import type { MobileJwtPayload } from "@/lib/mobile-auth"

const MOBILE_TOKEN_EXPIRES_IN = "30d"

/** Sign a mobile access token (Node runtime only — uses jsonwebtoken). */
export function signMobileToken(payload: MobileJwtPayload): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error("AUTH_SECRET is not set")
  }

  return jwt.sign(
    { userId: payload.userId, role: payload.role },
    secret,
    { expiresIn: MOBILE_TOKEN_EXPIRES_IN },
  )
}
