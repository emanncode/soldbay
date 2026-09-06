import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { POST as signup } from "@/app/api/auth/signup/route";
import { POST as login } from "@/app/api/auth/mobile-login/route";
import { DELETE as deleteMe } from "@/app/api/users/me/route";

/**
 * Verifies the account-deletion retention + email-reuse model end-to-end
 * against the configured database:
 *  1. the User.retainUntil + User.previousEmail columns exist;
 *  2. DELETE /api/users/me sets deletedAt + retainUntil (~ACCOUNT_RETENTION_YEARS),
 *     retains password/name, but moves the email to `previousEmail` and stamps
 *     `deleted+{id}@deleted.soldbay.app` so the address is freed immediately;
 *  3. a fresh login with the original email is blocked (401);
 *  4. a brand-new signup with the same email succeeds (address reused).
 * Creates and removes its own throwaway test accounts on a run.
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

async function cleanup(ids: string[]) {
  await prisma.$transaction(
    async (tx) => {
      await tx.session.deleteMany({ where: { userId: { in: ids } } });
      await tx.account.deleteMany({ where: { userId: { in: ids } } });
      await tx.user.deleteMany({ where: { id: { in: ids } } });
    },
  ).catch(() => undefined);
}

async function main(): Promise<void> {
  const cols: { column_name: string }[] = await prisma.$queryRawUnsafe(
    `SELECT column_name FROM information_schema.columns WHERE table_name='User' AND column_name IN ('retainUntil','previousEmail')`,
  );
  if (cols.length !== 2)
    throw new Error("expected retainUntil AND previousEmail columns — got: " + cols.map((c) => c.column_name).join(", "));
  console.log("STEP 1 — retainUntil + previousEmail columns exist: true");

  const runId = Date.now();
  const email = `retention.verify.${runId}@oauife.edu.ng`;
  const password = "RetentionPass123!";
  await prisma.user
    .deleteMany({
      where: { OR: [{ email }, { previousEmail: email }] },
    })
    .catch(() => undefined);

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
  const ids = [user.id];

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
  const placeholder = `deleted+${user.id}@deleted.soldbay.app`;
  if (after.email !== placeholder)
    throw new Error(`expected placeholder email, got "${after.email}"`);
  if (after.previousEmail !== email)
    throw new Error(`original email not preserved in previousEmail (got "${after.previousEmail}")`);
  if (after.password === null || after.name !== "Retention Verify")
    throw new Error("data was anonymized — retention broken");
  console.log(
    `STEP 2 — deletedAt + retainUntil (~${years.toFixed(2)}yrs); email moved to ${placeholder}; original in previousEmail; password/name intact: true`,
  );

  const relogin = await login(
    mockReq("http://localhost/api/auth/mobile-login", "POST", { email, password }),
  );
  if (relogin.status !== 401) throw new Error("login not blocked after deletion");
  console.log("STEP 3 — re-login with original email blocked (401): true");

  const resignup = await signup(
    mockReq("http://localhost/api/auth/signup", "POST", {
      email,
      password: "ReusedPass456!",
      name: "Reused Email User",
      role: "BUYER",
    }),
  );
  if (resignup.status !== 201) throw new Error("email-reuse signup failed");
  const reused = await prisma.user.findUnique({ where: { email } });
  if (reused) ids.push(reused.id);
  console.log("STEP 4 — re-signup with the (freed) email succeeds (201): true");

  await cleanup(ids);
  await prisma.$disconnect();
  console.log("\n✅ Retention + email-reuse verification PASSED");
}

main()
  .catch((e) => {
    console.error("\n❌ FAILURE:", e.message || e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });