import "dotenv/config";
import { prisma } from "@/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      deletedAt: true,
      retainUntil: true,
      previousEmail: true,
      createdAt: true,
      sellerProfile: {
        select: {
          _count: {
            select: { listings: true, orders: true },
          },
        },
      },
      _count: {
        select: {
          buyerOrders: true,
          sessions: true,
          accounts: true,
        },
      },
    },
  });
  console.log(`USERS TOTAL: ${users.length}`);
  for (const u of users) {
    console.log(
      [
        `id=${u.id}`,
        `email=${u.email}`,
        `role=${u.role}`,
        `name=${JSON.stringify(u.name)}`,
        `created=${u.createdAt.toISOString().slice(0, 16)}`,
        u.deletedAt
          ? `deleted=${u.deletedAt.toISOString().slice(0, 16)}`
          : null,
        u.previousEmail ? `prev=${u.previousEmail}` : null,
        `sellerListings=${u.sellerProfile?._count.listings ?? 0}`,
        `sellerOrders=${u.sellerProfile?._count.orders ?? 0}`,
        `buyerOrders=${u._count.buyerOrders}`,
        `sessions=${u._count.sessions}`,
        `accounts=${u._count.accounts}`,
      ]
        .filter(Boolean)
        .join("  |  "),
    );
  }
  await prisma.$disconnect();
  console.log("");
  console.log("RELATED-TABLE COUNTS:");
  for (const [table, count] of [
    ["SellerProfile", await prisma.sellerProfile.count()],
    ["Listing", await prisma.listing.count()],
    ["Order", await prisma.order.count()],
    ["Session", await prisma.session.count()],
    ["Account", await prisma.account.count()],
    ["Dispute", await prisma.dispute.count()],
    ["WalletTransaction", await prisma.walletTransaction.count()],
  ]) {
    console.log(`  ${table}: ${count}`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("ERROR:", e.message || e);
  process.exit(1);
});
