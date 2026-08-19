import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

async function warmup(prisma: PrismaClient, retries = 5, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Warming up database connection (attempt ${i + 1}/${retries})...`);
      await prisma.$queryRawUnsafe("SELECT 1");
      console.log("✅ Database connection established.");
      return;
    } catch (e: any) {
      console.warn(`Connection attempt failed: ${e.message || e}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw new Error("Could not connect to database after several retries.");
}

async function main() {
  console.log("Connecting to database to clear tables...");
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    await warmup(prisma);

    // Delete in reverse order of foreign key relationships
    console.log("Deleting listings...");
    await prisma.listing.deleteMany();

    console.log("Deleting seller profiles...");
    await prisma.sellerProfile.deleteMany();

    console.log("Deleting sessions...");
    await prisma.session.deleteMany();

    console.log("Deleting accounts...");
    await prisma.account.deleteMany();

    console.log("Deleting verification tokens...");
    await prisma.verificationToken.deleteMany();

    console.log("Deleting waitlist signups...");
    await prisma.waitlistSignup.deleteMany();

    console.log("Deleting site questions...");
    await prisma.siteQuestion.deleteMany();

    console.log("Deleting users...");
    await prisma.user.deleteMany();

    console.log("Deleting universities...");
    await prisma.university.deleteMany();

    console.log("Deleting categories...");
    await prisma.category.deleteMany();

    console.log("✅ Database cleared successfully!");
  } catch (error: any) {
    console.error("❌ Error clearing database:", error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
