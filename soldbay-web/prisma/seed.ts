import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const categories = [
  { name: "Textbooks", slug: "textbooks", commissionRate: 5 },
  { name: "Electronics", slug: "electronics", commissionRate: 8 },
  { name: "Fashion", slug: "fashion", commissionRate: 15 },
  { name: "Food", slug: "food", commissionRate: 10 },
  { name: "Services", slug: "services", commissionRate: 12 },
]

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const count = await prisma.category.count()
  console.log(`Seeded ${count} categories`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
