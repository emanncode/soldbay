import "dotenv/config";
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

const universities = [
  { name: "Adekunle Ajasin University, Akungba-Akoko", code: "AAUA" },
  { name: "University of Lagos", code: "UNILAG" },
  { name: "Covenant University", code: "CU" },
  { name: "University of Ibadan", code: "UI" },
  { name: "Obafemi Awolowo University", code: "OAU" },
  { name: "University of Nigeria, Nsukka", code: "UNN" },
  { name: "Ahmadu Bello University", code: "ABU" },
  { name: "Federal University of Technology, Akure", code: "FUTA" },
  { name: "University of Benin", code: "UNIBEN" },
  { name: "Babcock University", code: "BU" },
  { name: "Landmark University", code: "LMU" },
  { name: "Pan-Atlantic University", code: "PAU" },
  { name: "Bowen University", code: "BOWEN" },
  { name: "University of Ilorin", code: "UNILORIN" },
  { name: "Lagos State University", code: "LASU" },
  { name: "Federal University of Technology, Minna", code: "FUTMINNA" },
  { name: "University of Port Harcourt", code: "UNIPORT" },
  { name: "University of Abuja", code: "UNIABUJA" },
  { name: "Federal University of Agriculture, Abeokuta", code: "FUNAAB" },
  { name: "Federal University of Technology, Owerri", code: "FUTO" },
  { name: "Nnamdi Azikiwe University", code: "UNIZIK" },
  { name: "Bayero University Kano", code: "BUK" },
  { name: "Delta State University, Abraka", code: "DELSU" },
  { name: "Ekiti State University", code: "EKSU" },
  { name: "Olabisi Onabanjo University", code: "OOU" },
  { name: "Osun State University", code: "UNIOSUN" },
  { name: "Rivers State University", code: "RSU" },
  { name: "University of Ghana", code: "UG" },
  { name: "Kwame Nkrumah University of Science and Technology", code: "KNUST" },
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

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { code: uni.code },
      update: { name: uni.name },
      create: uni,
    });
  }

  const catCount = await prisma.category.count();
  const uniCount = await prisma.university.count();
  console.log(`Seeded ${catCount} categories and ${uniCount} universities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
