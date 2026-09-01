import { del } from "@vercel/blob"

/**
 * Best-effort deletion of Vercel Blob image objects. Only URLs that point at
 * the configured Blob store are sent to `del`, so we never touch arbitrary
 * external URLs. Failures are logged and swallowed — orphan cleanup must never
 * break the surrounding (draft/listing) operation.
 */
export async function deleteBlobImages(urls: Array<string | null | undefined>): Promise<void> {
  const toDelete = urls.filter((u): u is string => Boolean(u))

  if (toDelete.length === 0) return

  try {
    await del(toDelete, { token: process.env.BLOB_READ_WRITE_TOKEN })
  } catch (error) {
    console.error("Failed to delete blob images:", error)
  }
}
