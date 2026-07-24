import "dotenv/config"
import pg from "pg"

const NEON_URL = process.env.DATABASE_URL_UNPOOLED!
const PP_URL = process.env.DATABASE_URL!

async function complete() {
  const src = new pg.Client({ connectionString: NEON_URL, connectionTimeoutMillis: 20000 })
  const dst = new pg.Client({ connectionString: PP_URL, connectionTimeoutMillis: 20000 })
  
  console.log("Connecting...")
  await src.connect()
  await dst.connect()
  console.log("Connected\n")

  // Categories
  const cats = (await src.query('SELECT * FROM "Category"')).rows
  console.log(`Categories: ${cats.length} in Neon`)
  for (const c of cats) {
    const exists = (await dst.query('SELECT 1 FROM "Category" WHERE id = $1', [c.id])).rows.length
    if (exists) { console.log(`  ${c.name} — already exists, skipping`); continue }
    await dst.query(
      'INSERT INTO "Category" (id, name, slug, "commissionRate") VALUES ($1, $2, $3, $4)',
      [c.id, c.name, c.slug, c.commissionRate]
    )
    console.log(`  ${c.name} — inserted`)
  }

  // Listings
  const listings = (await src.query('SELECT * FROM "Listing"')).rows
  console.log(`\nListings: ${listings.length} in Neon`)
  for (const l of listings) {
    const exists = (await dst.query('SELECT 1 FROM "Listing" WHERE id = $1', [l.id])).rows.length
    if (exists) { console.log(`  ${l.title?.substring(0, 40)} — already exists, skipping`); continue }
    try {
      await dst.query(
        `INSERT INTO "Listing" (id, "sellerId", "categoryId", title, description, price, images, stock, status, "createdAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [l.id, l.sellerId, l.categoryId, l.title, l.description, l.price, l.images, l.stock, l.status, l.createdAt]
      )
      console.log(`  ${l.title?.substring(0, 40)} — inserted`)
    } catch (e: any) {
      console.error(`  ${l.title?.substring(0, 40)} — FAILED: ${e.message?.substring(0, 100)}`)
    }
  }

  // Summary
  console.log("\n=== Final counts ===")
  for (const t of ["University", "Category", "User", "SellerProfile", "Listing", "SiteQuestion", "WaitlistSignup"]) {
    const r = await dst.query(`SELECT count(*) FROM "${t}"`)
    console.log(`  ${t}: ${r.rows[0].count}`)
  }

  await src.end()
  await dst.end()
  console.log("\n✅ Done")
}

complete().catch((e) => {
  console.error("❌ Failed:", e.message)
  process.exit(1)
})
