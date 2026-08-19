import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Textbooks", slug: "textbooks", commissionRate: 5 },
  { name: "Electronics", slug: "electronics", commissionRate: 8 },
  { name: "Fashion", slug: "fashion", commissionRate: 15 },
  { name: "Food", slug: "food", commissionRate: 10 },
  { name: "Services", slug: "services", commissionRate: 12 },
];

async function warmup(retries = 5, delayMs = 1500) {
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
  await warmup();

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const count = await prisma.category.count();
  console.log(`Seeded ${count} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
