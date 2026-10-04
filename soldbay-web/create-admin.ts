import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function warmup(retries = 5, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Warming up database connection (attempt ${i + 1}/${retries})...`);
      await prisma.$queryRawUnsafe("SELECT 1");
      console.log("✅ Database connection established.");
      return;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`Connection attempt failed: ${msg}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw new Error("Could not connect to database after several retries.");
}

async function createAdmin() {
  await warmup();

  const email = "olajubajeifeoluwa93@gmail.com";
  const pass = "admin";
  const hashedPassword = await bcrypt.hash(pass, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      name: "Admin User",
    }
  });

  console.log(`Admin created/updated: ${admin.email} / password: ${pass}`);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
