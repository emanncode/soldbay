import { PrismaClient } from "@/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function getPrisma() {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      connectionTimeoutMillis: 30000,
    })
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.prisma
}

export const prisma = getPrisma()
