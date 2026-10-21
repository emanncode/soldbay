# Soldbay Web and Backend

This Next.js application provides the public waitlist site, shared API for the
mobile client, and the currently implemented admin waitlist page. It uses
Next.js 16, React 19, TypeScript, Prisma, and PostgreSQL. See
[`SETUP.md`](SETUP.md) for local setup and [../docs/architecture.md](../docs/architecture.md)
for the code-checked API and data model.

## Run locally

**Brand-theme status:** the current web styles still use the superseded olive
palette. The Linear orange/teal design decision has not yet been applied to the
web landing/admin surface.

1. Install dependencies with `npm install`.
2. Configure the environment described in `SETUP.md`.
3. Apply the existing migrations with `npx prisma migrate deploy` and seed if
   needed with `npm run seed`.
4. Start the app with `npm run dev`.

The public landing page is at `/`. Admin currently exposes login and the
waitlist page. The admin API includes seller-verification and dispute endpoints;
those APIs do not imply that all designed Admin/Ops screens exist yet.

## Checks

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build` (requires a usable Prisma configuration and database access
  for build-time data reads)

The endpoint script `test_all_endpoints.ts` writes test records to the configured
database and uploads a verification image. Run it only with explicitly
disposable database and blob-storage credentials. It is an integration script,
not an isolated unit-test suite.

Product decisions and UI design rules live in the AllOnSoldBay Linear project.
The repository code documents implementation state; update this README and the
architecture doc when that state changes.
