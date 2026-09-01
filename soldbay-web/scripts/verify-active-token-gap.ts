import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";
import { verifyActiveMobileToken } from "@/lib/mobile-auth-active";
import { signMobileToken } from "@/lib/sign-mobile-token";
import { POST as signup } from "@/app/api/auth/signup/route";
import { DELETE as deleteMe } from "@/app/api/users/me/route";

/**
 * Verifies that a still-valid mobile JWT issued to an account that is later
 * soft-deleted can no longer authenticate API requests.
 *
 * The stateless `verifyMobileToken` only checks the signature (tokens live
 * up to MOBILE_TOKEN_EXPIRES_IN, ~30 days), so it would keep accepting a
 * deleted account's token. `verifyActiveMobileToken` additionally checks
 * User.deletedAt in the DB and must reject it.
 *
 * Creates and removes its own throwaway test user on a run.
 */
function mockReq(url: string, method: string, body?: unknown, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers["authorization"] = `Bearer ${token}`;
  if (body !== undefined) headers["content-type"] = "application/json";
  return new Request(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function main(): Promise<void> {
  const runId = Date.now();
  const email = `gap.verify.${runId}@oauife.edu.ng`;
  const password = "GapTestPass123!";

  const signupRes = await signup(
    mockReq("http://localhost/api/auth/signup", "POST", {
      email,
      password,
      name: "Gap Verify",
      role: "BUYER",
    }),
  );
  if (signupRes.status !== 201) throw new Error("signup failed");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("user not created");

  const jwt = signMobileToken({ userId: user.id, role: user.role as "BUYER" | "SELLER" | "ADMIN" });

  const activeStrict = await verifyActiveMobileToken(jwt);
  if (!activeStrict) throw new Error("strict verify should pass for active account");
  console.log("ACTIVE — stateless & strict verify pass: true");

  const del = await deleteMe(mockReq("http://localhost/api/users/me", "DELETE", undefined, jwt));
  if (del.status !== 200) throw new Error("delete failed");

  const afterStateless = await verifyMobileToken(jwt);
  const afterStrict = await verifyActiveMobileToken(jwt);
  if (afterStateless === null)
    throw new Error("sanity: stateless should still validate signature");
  if (afterStrict !== null)
    throw new Error("GAP NOT CLOSED: strict verify allowed a deleted account");
  console.log("DELETED — stateless still validates signature (true), strict rejects (false): PASS");

  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
  console.log("\n✅ verifyActiveMobileToken gap verification PASSED");
}

main()
  .catch((e) => {
    console.error("\n❌ FAILURE:", e.message || e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
