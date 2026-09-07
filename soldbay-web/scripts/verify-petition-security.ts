import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { signMobileToken } from "@/lib/sign-mobile-token";

import { POST as petition, GET as getPetitionStatus } from "@/app/api/sellers/petition/route";
import { POST as refreshToken } from "@/app/api/auth/refresh-token/route";
import { GET as sellerMe } from "@/app/api/sellers/me/route";
import { POST as adminDecision } from "@/app/api/admin/verifications/[id]/decision/route";

/**
 * Security-focused exercise of the "petition to become a seller" flow.
 *
 * Goals:
 *  1. Prove the petition endpoint is immune to mass assignment (role, status,
 *     wallet, attempts) and SQL/HTML injection — the body is never read and the
 *     username is derived server-side from the stored name.
 *  2. Prove a petitioning buyer gains NO seller powers until an admin decides.
 *  3. Prove the admin decision is the ONLY role-flip point, admin-only, and a
 *     rejection keeps the user a BUYER who may petition again.
 *  4. Prove POST /api/auth/refresh-token heals a stale BUYER-role JWT after
 *     approval by re-signing with the DB role — and never accepts a client role.
 *
 * Creates only throwaway users/profiles and deletes exactly those rows
 * afterwards, so it is safe to run against the shared dev database.
 */

const runId = Date.now().toString().slice(-8);
const passwordDummy = "SecurityTest!123";
let failures = 0;

function assert(cond: boolean, label: string) {
  if (cond) console.log(`  [PASS] ${label}`);
  else {
    failures++;
    console.log(`  [FAIL] ${label}`);
  }
}

function createMockRequest(
  url: string,
  options: { method?: string; body?: unknown; token?: string } = {},
) {
  const headers: Record<string, string> = {};
  if (options.token) headers["authorization"] = `Bearer ${options.token}`;
  const method = options.method || (options.body !== undefined ? "POST" : "GET");
  let init: RequestInit = { method, headers };
  if (options.body !== undefined) {
    headers["content-type"] = "application/json";
    init = { ...init, body: JSON.stringify(options.body) };
  }
  return new Request(url, init);
}

async function createUser(data: {
  email: string;
  name: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  universityId?: string;
  deletedAt?: Date | null;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      password: passwordDummy,
      name: data.name,
      role: data.role,
      deletedAt: data.deletedAt ?? null,
      ...(data.universityId
        ? { university: { connect: { id: data.universityId } } }
        : {}),
    },
    select: { id: true },
  });
}

async function main() {
  console.log("==============================================");
  console.log("LOCK SOLDBAY PETITION FLOW - SECURITY TEST SUITE");
  console.log("==============================================\n");

  const university = await prisma.university.findFirst();
  if (!university) throw new Error("No universities found; seed the DB first.");
  console.log(`Using university: ${university.name} (${university.id})\n`);

  const buyerA = await createUser({ email: `pet.a.${runId}@oauife.edu.ng`, name: "Robert'); DROP TABLE User;--", role: "BUYER", universityId: university.id });
  const buyerB = await createUser({ email: `pet.b.${runId}@oauife.edu.ng`, name: "Grace Okafor", role: "BUYER", universityId: university.id });
  const buyerNoUni = await createUser({ email: `pet.nouni.${runId}@oauife.edu.ng`, name: "No University Buyer", role: "BUYER" });
  const naturalSeller = await createUser({ email: `pet.seller.${runId}@oauife.edu.ng`, name: "Existing Seller", role: "SELLER", universityId: university.id });
  const deletedBuyer = await createUser({ email: `pet.deleted.${runId}@oauife.edu.ng`, name: "Gone Buyer", role: "BUYER", universityId: university.id, deletedAt: new Date() });
  const admin = await createUser({ email: `pet.admin.${runId}@soldbay.local`, name: "Security Admin", role: "ADMIN", universityId: university.id });

  await prisma.sellerProfile.create({ data: { userId: naturalSeller.id, username: `natseller_${runId}` } });

  const buyerAToken = signMobileToken({ userId: buyerA.id, role: "BUYER" });
  const buyerBToken = signMobileToken({ userId: buyerB.id, role: "BUYER" });
  const buyerNoUniToken = signMobileToken({ userId: buyerNoUni.id, role: "BUYER" });
  const naturalSellerToken = signMobileToken({ userId: naturalSeller.id, role: "SELLER" });
  const deletedToken = signMobileToken({ userId: deletedBuyer.id, role: "BUYER" });
  const adminToken = signMobileToken({ userId: admin.id, role: "ADMIN" });

  // PART2

  // =====================================================================
  // 1. Mass-assignment / injection resistance of POST /api/sellers/petition
  // =====================================================================
  console.log("1. Mass-assignment / injection resistance of petition");
  {
    const hostileBody = {
      role: "ADMIN",
      verificationStatus: "APPROVED",
      rejectionReason: 'x"); DROP TABLE "Listing";--',
      username: "HACKED_ADMIN",
      businessName: "<script>alert(1)</script>",
      bio: "owned",
      wallet: "999999999",
      sellerProfileId: "deadbeef",
      name: "HACKER",
    };
    const res = await petition(
      createMockRequest("http://localhost:3000/api/sellers/petition", { token: buyerAToken, body: hostileBody }),
    );
    const data = await res.json();
    assert(res.status === 201 || res.status === 200, `hostile body still returns ${res.status} (create/no-op)`);
    assert(data.ok === true, "response has ok:true");

    const profile = await prisma.sellerProfile.findUnique({ where: { userId: buyerA.id }, include: { user: true } });
    assert(profile !== null, "SellerProfile was created");
    assert(profile!.user.role === "BUYER", "User.role STILL BUYER (mass-assigned role ignored)");
    assert(profile!.verificationStatus === "PENDING", "verificationStatus is PENDING (APPROVED ignored)");
    assert(Number(profile!.walletBalance) === 0 && profile!.user.name.includes("Robert"), "wallet/name were not overwritten by the body");
    assert(/^[a-z0-9]{1,30}$/.test(profile!.username), `auto username "${profile!.username}" is slug-safe [a-z0-9]`);
    assert(!/[;"\']/.test(profile!.username), "username contains no SQL quotes/semicolons");
  }

  // =====================================================================
  // 2. Idempotency: re-petition does not duplicate the profile
  // =====================================================================
  console.log("\n2. Idempotency of petition");
  {
    const res1 = await petition(
      createMockRequest("http://localhost:3000/api/sellers/petition", { token: buyerAToken, body: { role: "SELLER", verificationStatus: "APPROVED" } }),
    );
    const d1 = await res1.json();
    assert(res1.status === 200 && d1.alreadyPending === true, "second petition is a 200 no-op (alreadyPending)");

    const count = await prisma.sellerProfile.count({ where: { userId: buyerA.id } });
    assert(count === 1, `exactly one SellerProfile row (got ${count})`);

    const resStatus = await getPetitionStatus(createMockRequest("http://localhost:3000/api/sellers/petition", { token: buyerAToken }));
    const ds = await resStatus.json();
    assert(ds.petitionStatus === "PENDING", "GET petition status reports PENDING");
  }

  // =====================================================================
  // 3. Petitioning grants NO seller powers (JWT role still BUYER)
  // =====================================================================
  console.log("\n3. Buyer gains no seller powers after petitioning");
  {
    const res = await sellerMe(createMockRequest("http://localhost:3000/api/sellers/me", { token: buyerAToken }));
    assert(res.status === 401, `GET /api/sellers/me with petitioning buyer -> ${res.status} (401)`);
  }

  // =====================================================================
  // 4. Edge cases: deleted user, no university, existing seller, anonymous
  // =====================================================================
  console.log("\n4. Edge cases (auth & eligibility)");
  {
    const resDeleted = await petition(createMockRequest("http://localhost:3000/api/sellers/petition", { token: deletedToken }));
    assert(resDeleted.status === 401, `soft-deleted user petition -> ${resDeleted.status} (401)`);

    const resNoUni = await petition(createMockRequest("http://localhost:3000/api/sellers/petition", { token: buyerNoUniToken }));
    assert(resNoUni.status === 403, `buyer without university petition -> ${resNoUni.status} (403)`);

    const resSeller = await petition(createMockRequest("http://localhost:3000/api/sellers/petition", { token: naturalSellerToken }));
    assert(resSeller.status === 409, `existing SELLER petition -> ${resSeller.status} (409)`);

    const resAnon = await petition(createMockRequest("http://localhost:3000/api/sellers/petition", { token: "bogus.invalid.token" }));
    assert(resAnon.status === 401, `invalid token petition -> ${resAnon.status} (401)`);
  }

  // =====================================================================
  // 5. Non-admin cannot approve/reject
  // =====================================================================
  console.log("\n5. Admin-only decision gate");
  {
    const resPetition = await petition(createMockRequest("http://localhost:3000/api/sellers/petition", { token: buyerBToken }));
    assert(resPetition.status === 201, "buyerB petitions (201)");

    const profile = await prisma.sellerProfile.findUnique({ where: { userId: buyerB.id } });
    const res = await adminDecision(
      createMockRequest("http://localhost:3000/api/admin/verifications/x/decision", { method: "POST", token: buyerBToken, body: { action: "APPROVE" } }),
      { params: Promise.resolve({ id: profile!.id }) },
    );
    assert(res.status === 403, `buyer trying to approve -> ${res.status} (403)`);
  }

  // =====================================================================
  // 6. Admin APPROVE is the only role flip, and it flips to exactly SELLER
  // =====================================================================
  console.log("\n6. Admin APPROVE flips role BUYER -> SELLER");
  {
    const profile = await prisma.sellerProfile.findUnique({ where: { userId: buyerB.id } });

    // Hostile body on the decision too: try to escalate role to ADMIN.
    const resDecision = await adminDecision(
      createMockRequest("http://localhost:3000/api/admin/verifications/x/decision", { method: "POST", token: adminToken, body: { action: "APPROVE", role: "ADMIN" } }),
      { params: Promise.resolve({ id: profile!.id }) },
    );
    const dd = await resDecision.json();
    assert(resDecision.status === 200 && dd.ok === true, "admin approve succeeds");

    const after = await prisma.sellerProfile.findUnique({ where: { userId: buyerB.id }, include: { user: true } });
    assert(after!.verificationStatus === "APPROVED", "verificationStatus is APPROVED");
    assert(after!.user.role === "SELLER", "User.role flipped to SELLER");
  }

  // =====================================================================
  // 7. Stale BUYER token heals via POST /api/auth/refresh-token
  // =====================================================================
  console.log("\n7. Stale-token heal via refresh-token");
  {
    const resOld = await sellerMe(createMockRequest("http://localhost:3000/api/sellers/me", { token: buyerBToken }));
    assert(resOld.status === 401, "old BUYER JWT still 401 on seller routes (snapshot not auto-updated)");

    const resRefresh = await refreshToken(createMockRequest("http://localhost:3000/api/auth/refresh-token", { method: "POST", token: buyerBToken }));
    const dr = await resRefresh.json();
    assert(resRefresh.status === 200 && dr.user.role === "SELLER", `refresh re-signs with DB role SELLER (got ${dr.user?.role})`);

    const resNew = await sellerMe(createMockRequest("http://localhost:3000/api/sellers/me", { token: dr.token }));
    assert(resNew.status === 200, "freshly refreshed token works on seller routes");
  }

  // =====================================================================
  // 8. Rejection keeps BUYER and allows a re-petition
  // =====================================================================
  console.log("\n8. Reject stays BUYER, re-petition allowed");
  {
    const profileA = await prisma.sellerProfile.findUnique({ where: { userId: buyerA.id } });

    const resDecline = await adminDecision(
      createMockRequest("http://localhost:3000/api/admin/verifications/x/decision", { method: "POST", token: adminToken, body: { action: "REJECT", reason: "Does not match a current student." } }),
      { params: Promise.resolve({ id: profileA!.id }) },
    );
    const dd = await resDecline.json();
    assert(resDecline.status === 200 && dd.verification.verificationStatus === "REJECTED", "reject succeeds with reason");

    const declined = await prisma.sellerProfile.findUnique({ where: { userId: buyerA.id }, include: { user: true } });
    assert(declined!.user.role === "BUYER", "reject keeps User.role BUYER");
    assert(declined!.rejectionReason === "Does not match a current student.", "rejection reason stored");

    const resRe = await petition(createMockRequest("http://localhost:3000/api/sellers/petition", { token: buyerAToken, body: { verificationStatus: "APPROVED" } }));
    const dr = await resRe.json();
    assert(resRe.status === 201 && dr.verificationStatus === "PENDING", "re-petition restarts to PENDING (201)");

    const rep = await prisma.sellerProfile.findUnique({ where: { userId: buyerA.id } });
    assert(rep!.verificationStatus === "PENDING" && rep!.rejectionReason === null, "re-petition clears rejection reason + status PENDING");
    assert(rep!.verificationAttempts >= 1, `verificationAttempts incremented (${rep!.verificationAttempts})`);
  }

  // =====================================================================
  // 9. Refresh-token never accepts a client-supplied role
  // =====================================================================
  console.log("\n9. Refresh-token ignores client-supplied role");
  {
    const res = await refreshToken(
      createMockRequest("http://localhost:3000/api/auth/refresh-token", { method: "POST", token: buyerNoUniToken, body: { role: "ADMIN" } }),
    );
    const data = await res.json();
    assert(res.status === 200 && data.user.role === "BUYER", `role comes from DB only (got ${data.user?.role}, not ADMIN)`);
  }

  // ---------------------------------------------------------------------
  // Cleanup: delete only this run's throwaway rows.
  // ---------------------------------------------------------------------
  const ids = [buyerA.id, buyerB.id, buyerNoUni.id, naturalSeller.id, deletedBuyer.id, admin.id];
  await prisma.sellerProfile.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  console.log("\nCleanup: removed throwaway users and seller profiles.\n");

  console.log("==============================================");
  if (failures === 0) {
    console.log("ALL PETITION SECURITY TESTS PASSED");
  } else {
    console.log(`${failures} TEST(S) FAILED`);
  }
  console.log("==============================================");
  process.exit(failures === 0 ? 0 : 1);
}

main()
  .catch((err) => {
    console.error("\nSCRIPT FAILED:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());