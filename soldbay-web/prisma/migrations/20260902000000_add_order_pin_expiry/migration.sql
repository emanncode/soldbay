-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "pinShownAt" TIMESTAMP(3),
    ADD COLUMN "pinExpiresAt" TIMESTAMP(3);