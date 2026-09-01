import { NextResponse } from "next/server"
import { purgeExpiredAccounts } from "@/lib/account-retention"

export const dynamic = "force-dynamic"

/**
 * Scheduled job (Vercel Cron) that purges/anonymizes soft-deleted accounts
 * whose 5-year retention window has elapsed. Must be called with the CRON
 * secret to prevent public invocation.
 */
export async function GET(request: Request) {
  if (
    process.env.CRON_SECRET &&
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const purged = await purgeExpiredAccounts()
    return NextResponse.json({ ok: true, purged })
  } catch (error) {
    console.error("Purge accounts cron error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
