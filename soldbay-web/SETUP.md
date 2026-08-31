# Soldbay Backend Setup

## 1. Get a Postgres connection string

The backend uses **Prisma Postgres** (hosted at `db.prisma.io`) as its single
database — there is no separate Neon project. Grab the connection string from
your Prisma Console / Postgres dashboard and copy it into `.env`.

## 2. Set env vars

Open `.env` and set the database URL:

```
DATABASE_URL="postgres://..."
```

Also set `AUTH_SECRET` and `AUTH_URL`. `AUTH_URL` must point at the backend
origin (for example `http://localhost:3000` in local dev).

## 3. Apply migrations

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