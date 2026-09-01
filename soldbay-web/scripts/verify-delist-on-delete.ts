import "dotenv/config";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { GET as getListings } from "@/app/api/listings/route";
import { GET as getListingDetail } from "@/app/api/listings/[id]/route";

/**
 * Verifies that soft-deleting a seller's account automatically hides their
 * still-ACTIVE listings from public browse/search and detail, while keeping
 * the listing data itself intact (same retention logic as the account).
 * Creates and removes its own throwaway seller + listing on a run.
 */
async function main(): Promise<void> {
  const runId = Date.now();
  const email = `delist.verify.${runId}@oauife.edu.ng`;
  const username = `delist_verify_${runId}`;
  const slug = `dlcatverify_${runId}`;
  let listingId = "";

  const user = await prisma.user.create({
    data: { email, name: "Delist Verify Seller", role: "SELLER", password: "x" },
  });
  const seller = await prisma.sellerProfile.create({
    data: { userId: user.id, username, verificationStatus: "APPROVED" },
  });
  const cat = await prisma.category.create({
    data: { name: `DL Verify ${runId}`, slug, commissionRate: 0.1 },
  });
  const listing = await prisma.listing.create({
    data: {
      sellerId: seller.id,
      categoryId: cat.id,
      title: "Delist Verify Listing",
      description: "should disappear from browse after account deletion",
      price: 100,
      images: [],
      stock: 5,
      status: "ACTIVE",
    },
  });
  listingId = listing.id;

  const list1 = (await (await getListings(new NextRequest("http://localhost/api/listings"))).json()) as {
    items: { id: string }[];
  };
  const beforeBrowse = list1.items.some((i) => i.id === listingId);
  const det1 = await getListingDetail(new Request("http://localhost/api/listings/x"), {
    params: Promise.resolve({ id: listingId }),
  });
  console.log("BEFORE deletion — browse visible:", beforeBrowse, "| detail status:", det1.status);
  if (!beforeBrowse || det1.status !== 200)
    throw new Error("listing should be visible before deletion");

  await prisma.user.update({
    where: { id: user.id },
    data: { deletedAt: new Date(), retainUntil: new Date(Date.now() + 1000) },
  });

  const list2 = (await (await getListings(new NextRequest("http://localhost/api/listings"))).json()) as {
    items: { id: string }[];
  };
  const afterBrowse = list2.items.some((i) => i.id === listingId);
  const det2 = await getListingDetail(new Request("http://localhost/api/listings/x"), {
    params: Promise.resolve({ id: listingId }),
  });
  const rowStillThere = !!(await prisma.listing.findUnique({ where: { id: listingId } }));
  console.log(
    "AFTER deletion — browse visible:",
    afterBrowse,
    "| detail status:",
    det2.status,
    "| row retained:",
    rowStillThere,
  );
  if (afterBrowse || det2.status !== 404)
    throw new Error("listing should be hidden after account deletion");
  if (!rowStillThere) throw new Error("listing data should be retained, not purged");

  // Cleanup in FK order.
  await prisma.listing.delete({ where: { id: listingId } }).catch(() => undefined);
  await prisma.category.delete({ where: { id: cat.id } }).catch(() => undefined);
  await prisma.sellerProfile.delete({ where: { id: seller.id } }).catch(() => undefined);
  await prisma.user.delete({ where: { id: user.id } }).catch(() => undefined);

  await prisma.$disconnect();
  console.log("\n✅ Delisting verification PASSED");
}

main()
  .catch((e) => {
    console.error("\n❌ FAILURE:", e.message || e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
