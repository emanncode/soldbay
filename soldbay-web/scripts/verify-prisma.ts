import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
  const prisma = new PrismaClient({ adapter })

  const count = await prisma.category.count()
  console.log(`✅ Connected — ${count} categories in database`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("❌ Connection failed:", e.message)
  process.exit(1)
})
