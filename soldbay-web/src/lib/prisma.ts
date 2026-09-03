import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

/**
 * Builds a PrismaPg driver adapter tuned for the serverless Prisma Postgres
 * compute (db.prisma.io) that powers this project.
 *
 * The database compute sleeps after a period of inactivity and takes ~15-25s
 * to wake on the first request. Naive pool settings (short connection timeout
 * + aggressive idle eviction) turn that expected cold start into a hard 500
 * with a "Connection terminated" (P1017) / "ConnectionClosed" error. These
 * settings instead tolerate the slow wake and keep warm connections alive so
 * subsequent requests don't re-trigger a cold start.
 */
function buildAdapter() {
  return new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    // Keep idle connections around far longer than the default so we don't
    // evict a warm connection and force another 15-25s cold wake.
    idleTimeoutMillis: 10 * 60_000,
    // A cold start routinely takes 15-25s. Give the wake a generous window so
    // a slow (but healthy) first connection succeeds instead of timing out.
    connectionTimeoutMillis: 45_000,
    // Detect dead connections on long-lived sockets.
    keepAlive: true,
    keepAliveInitialDelayMillis: 30_000,
  })
}

function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ adapter: buildAdapter() })
  }
  return globalForPrisma.prisma
}

export const prisma = getPrisma()
