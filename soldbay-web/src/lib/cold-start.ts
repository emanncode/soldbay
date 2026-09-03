/**
 * Cold-start tolerant retry for Prisma Postgres (db.prisma.io).
 *
 * The serverless compute sleeps when idle and can take 15-25s to wake up. The
 * very first query after a sleep sometimes still trips over connection errors
 * (P1017 "Server has closed the connection", driver "ConnectionClosed",
 * connection timeouts) even with a generous connectionTimeoutMillis. Those are
 * transient wake-up failures, not real errors, so we retry once — after a warm
 * attempt the socket is live and the retry almost always succeeds instantly.
 */

const RETRY_DELAY_MS = 800

const COLD_START_MARKERS = [
  "server has closed the connection",
  "corrupted",
  "connection terminated",
  "connectionclosed",
  "connection closed",
  "timeout exceeded when trying to connect",
  "terminated due to connection timeout",
  "unable to start a transaction in the given time",
]

function isColdStartError(error: unknown): boolean {
  if (!error) return false
  const message =
    (typeof error === "object" &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string" &&
      (error as { message: string }).message) ||
    String(error)

  const normalized = message.toLowerCase()
  return COLD_START_MARKERS.some((marker) => normalized.includes(marker))
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Runs `fn`, retrying once if it fails with a Prisma cold-start / dropped
 * connection error. Use for one-off auth-critical queries where a transient
 * 500 would otherwise be surfaced to the user.
 */
export async function retryOnColdStart<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (!isColdStartError(error)) throw error
    await sleep(RETRY_DELAY_MS)
    return fn()
  }
}
