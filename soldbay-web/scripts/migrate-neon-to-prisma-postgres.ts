import "dotenv/config"
import pg from "pg"

const NEON_URL = process.env.DATABASE_URL_UNPOOLED!
const PP_URL = process.env.DATABASE_URL!

const TABLES_IN_ORDER = [
  "University",
  "Category",
  "User",
  "Account",
  "Session",
  "VerificationToken",
  "SellerProfile",
  "Listing",
  "SiteQuestion",
  "WaitlistSignup",
]

const TEXT_COLUMNS: Record<string, Set<string>> = {
  Account: new Set(["refresh_token", "access_token", "id_token"]),
}

async function migrate() {
  const src = new pg.Client({ connectionString: NEON_URL })
  const dst = new pg.Client({ connectionString: PP_URL })
  await src.connect()
  await dst.connect()

  console.log("Connected to Neon (source) and Prisma Postgres (target)\n")

  for (const table of TABLES_IN_ORDER) {
    const { rows: data } = await src.query(`SELECT * FROM "${table}"`)
    console.log(`${table}: ${data.length} rows`)

    if (data.length === 0) continue

    const cols = Object.keys(data[0])
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ")
    const colNames = cols.map((c) => `"${c}"`).join(", ")

    let inserted = 0
    for (const row of data) {
      const values = cols.map((c) => row[c])
      try {
        await dst.query(
          `INSERT INTO "${table}" (${colNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
          values,
        )
        inserted++
      } catch (e: any) {
        console.error(`  ⚠️  Failed to insert into ${table}: ${e.message?.substring(0, 120)}`)
      }
    }
    console.log(`  → ${inserted}/${data.length} inserted`)
  }

  console.log("\n✅ Migration complete")
  await src.end()
  await dst.end()
}

migrate().catch((e) => {
  console.error("❌ Migration failed:", e.message)
  process.exit(1)
})
