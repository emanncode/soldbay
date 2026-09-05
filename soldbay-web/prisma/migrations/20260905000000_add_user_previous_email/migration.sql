-- Store the user's original email before anonymizing it on soft-delete so the
-- address is immediately reusable for new signups. Cleared when the account is
-- purged after the retention window (see lib/account-retention.ts).
ALTER TABLE "User" ADD COLUMN "previousEmail" TEXT;