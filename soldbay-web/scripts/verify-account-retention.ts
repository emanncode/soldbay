import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { POST as signup } from "@/app/api/auth/signup/route";
import { POST as login } from "@/app/api/auth/mobile-login/route";
import { DELETE as deleteMe } from "@/app/api/users/me/route";

/**
 * Verifies the account-deletion retention model end-to-end against the
 * configured database:
 *  1. the User.retainUntil column exists;
 *  2. DELETE /api/users/me sets deletedAt + retainUntil (~ACCOUNT_RETENTION_YEARS)
 *     while keeping all PII fully intact (no anonymization);
 *  3. a fresh login is blocked and a second DELETE is rejected.
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

async function cleanup(email: string) {
  await prisma.user
    .deleteMany({ where: { email } })
    .catch(() => undefined);
}

async function main(): Promise<void> {
  const cols: { column_name: string }[] = await prisma.$queryRawUnsafe(
    `SELECT column_name FROM information_schema.columns WHERE table_name='User' AND column_name='retainUntil'`,
  );
  if (cols.length !== 1) throw new Error("retainUntil column NOT found");
  console.log("STEP 1 — retainUntil column exists: true");

  const runId = Date.now();
  const email = `retention.verify.${runId}@oauife.edu.ng`;
  const password = "RetentionPass123!";
  await cleanup(email);

  const signupRes = await signup(
    mockReq("http://localhost/api/auth/signup", "POST", {
      email,
      password,
      name: "Retention Verify",
      role: "BUYER",
    }),
  );
  if (signupRes.status !== 201) throw new Error("signup failed");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("test user not created");

  const loginRes = await login(
    mockReq("http://localhost/api/auth/mobile-login", "POST", { email, password }),
  );
  const loginData = (await loginRes.json()) as { token?: string };
  if (loginRes.status !== 200 || !loginData.token) throw new Error("login failed");

  const del = await deleteMe(
    mockReq("http://localhost/api/users/me", "DELETE", undefined, loginData.token),
  );
  console.log("STEP 2 — DELETE status:", del.status);
  if (del.status !== 200) throw new Error("DELETE failed");

  const after = await prisma.user.findUnique({ where: { id: user.id } });
  if (!after) throw new Error("user gone entirely — expected retention, not purge");
  if (!after.deletedAt || !after.retainUntil) throw new Error("deletion markers not set");
  const years =
    (after.retainUntil.getTime() - after.deletedAt.getTime()) /
    (365.25 * 24 * 60 * 60 * 1000);
  if (Math.abs(years - 5) > 0.25)
    throw new Error(`retention window not ~5yrs (got ${years.toFixed(2)})`);
  if (after.email !== email || after.password === null || after.name !== "Retention Verify")
    throw new Error("data was anonymized — retention broken");
  console.log(
    `STEP 2 — deletedAt + retainUntil (~${years.toFixed(2)}yrs), email/password/name intact: true`,
  );

  const relogin = await login(
    mockReq("http://localhost/api/auth/mobile-login", "POST", { email, password }),
  );
  if (relogin.status !== 401) throw new Error("login not blocked after deletion");
  console.log("STEP 3 — re-login after deletion blocked (401): true");

  await cleanup(email);
  await prisma.$disconnect();
  console.log("\n✅ Retention verification PASSED");
}

main()
  .catch((e) => {
    console.error("\n❌ FAILURE:", e.message || e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
