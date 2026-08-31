import { extractBearerToken, verifyMobileToken } from "@/lib/mobile-auth";
import { auth } from "@/auth";

/**
 * Returns true when the request is authenticated as an ADMIN (via mobile bearer
 * token or web session), false otherwise.
 */
export async function isAdmin(request: Request): Promise<boolean> {
  const bearer = extractBearerToken(request.headers.get("authorization"))
  if (bearer) {
    const mobileUser = await verifyMobileToken(bearer)
    return mobileUser?.role === "ADMIN"
  }
  const session = await auth()
  return session?.user?.role === "ADMIN"
}
