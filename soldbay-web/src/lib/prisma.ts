import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function getPrisma() {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    })
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.prisma
}

export const prisma = getPrisma()
