# Waitlist Backend Setup

## 1. Create a Neon project

Go to [neon.tech](https://neon.tech), create a project, and copy the connection string.

## 2. Set the database URL

Open `.env` and replace the placeholder:

```
DATABASE_URL="postgresql://your-neon-connection-string"
```

## 3. Run the initial migration

```sh
npx prisma migrate dev --name init
```

This creates the `WaitlistSignup` table in your Neon database.

## 4. (Optional) Verify with Prisma Studio

```sh
npx prisma studio
```

Opens a browser UI at `http://localhost:5555` where you can view and edit the `WaitlistSignup` table.

## 5. Start the dev server

```sh
npm run dev
```

## 6. Manual test

1. Open `http://localhost:3000/join/buyer` or `http://localhost:3000/join/seller`
2. Fill out and submit the form
3. Check Prisma Studio — the row should appear
4. Submit the same email again — you should see a friendly "already on the waitlist" error
