/**
 * One-off script to create the first admin user on soldbay-web.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@soldbay.com ADMIN_PASSWORD=secret123 ADMIN_NAME="Soldbay Admin" npm run seed:admin
 *
 * Reads credentials from environment variables — never hardcode them.
 * If a user with that email already exists, logs a message and exits cleanly.
 */

import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import bcrypt from "bcryptjs"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const PLACEHOLDER_UNIVERSITY_NAME = "Soldbay HQ"
const PLACEHOLDER_UNIVERSITY_CODE = "SBHQ"

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME

  if (!email || !password || !name) {
    console.error(
      "Missing required environment variables. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME."
    )
    process.exit(1)
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    console.log(`A user with email "${email}" already exists (id: ${existingUser.id}). Skipping.`)
    return
  }

  // Ensure the placeholder university exists (required by User schema).
  const university = await prisma.university.upsert({
    where: { code: PLACEHOLDER_UNIVERSITY_CODE },
    update: {},
    create: {
      name: PLACEHOLDER_UNIVERSITY_NAME,
      code: PLACEHOLDER_UNIVERSITY_CODE,
    },
  })

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "ADMIN",
      universityId: university.id,
    },
  })

  console.log(`Admin user created successfully:`)
  console.log(`  email: ${user.email}`)
  console.log(`  id:    ${user.id}`)
  console.log(`  role:  ${user.role}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
