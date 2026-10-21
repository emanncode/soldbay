# Soldbay Backend Setup

> **Status:** Setup commands below are operational notes, not product/design
> decisions. Check commands against the installed Prisma version before running
> schema-changing operations. Never run database-mutating setup against a
> production or non-disposable database without an explicit backup and plan.

## 1. Get a Postgres connection string

The backend uses PostgreSQL through Prisma. Configure the development
connection string for the provider actually in use and place it in the local
`.env` file.

## 2. Set env vars

Open `.env` and set the database URL (use a development database for local work):

```
DATABASE_URL="postgres://..."
```

Also set `AUTH_SECRET` and `AUTH_URL`. `AUTH_URL` must point at the backend
origin (for example `http://localhost:3000` in local dev).

## 3. Apply migrations

`migrate deploy` changes the target database. Confirm the URL points to the
intended development database before running it; never copy production values
into local test workflows.

```sh
npx prisma migrate deploy
```

This applies any pending migrations in `prisma/migrations/` to the database.

## 4. Seed (optional)

```sh
npx prisma db seed
```

Idempotent — safe to re-run.

## 5. Regenerate the Prisma client after schema changes

```sh
npx prisma generate
```

## 6. (Optional) Verify with Prisma Studio

```sh
npx prisma studio
```

Opens a browser UI at `http://localhost:5555`.

## 7. Start the dev server

```sh
npm run dev
```

## Creating a new migration

Never run `prisma migrate dev` (it can reset history). Use the diff workflow:

```sh
# edit prisma/schema.prisma first, then:
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script
```

Write the output into a new `prisma/migrations/<timestamp>_<name>/migration.sql`,
then apply with `npx prisma migrate deploy` and regenerate with
`npx prisma generate`.
