-- Reconciliation migration.
--
-- The Order / Dispute models and their status enums were added to the schema
-- and created on the live database out-of-band (via prisma db push) but were
-- never captured as a migration. Later migrations ALTER TABLE "Order", so a
-- fresh `prisma migrate deploy` would abort once it hit the first of those.
--
-- This migration creates the missing primitives so a fresh deploy can succeed.
-- Every statement is guarded (exception handlers + IF NOT EXISTS) so it is a
-- no-op against databases that already have the objects (the current live
-- database).

DO $$ BEGIN
  BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAYMENT_SECURED', 'PICKUP_ARRANGED', 'AWAITING_CONFIRMATION', 'COMPLETED', 'DISPUTED', 'REFUNDED', 'CANCELLED');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

DO $$ BEGIN
  BEGIN
    CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED_BUYER_REFUND', 'RESOLVED_SELLER_PAYOUT', 'CANCELLED');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

DO $$ BEGIN
  BEGIN
    CREATE TYPE "DisputeResolution" AS ENUM ('REFUND_BUYER', 'RELEASE_TO_SELLER');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- CreateTable "Order" -- WITHOUT the pin columns (those are added by the later
-- migrations 20260831000000_add_order_pin_lockout and
-- 20260902000000_add_order_pin_expiry, which must succeed on a fresh DB).
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PAYMENT_SECURED',
    "pickupLocation" TEXT,
    "confirmationPin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Dispute"
CREATE TABLE IF NOT EXISTS "Dispute" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'UNDER_REVIEW',
    "resolution" "DisputeResolution",
    "resolutionNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX IF NOT EXISTS "Order_buyerId_status_createdAt_idx" ON "Order"("buyerId", "status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Order_sellerId_status_createdAt_idx" ON "Order"("sellerId", "status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Order_status_createdAt_idx" ON "Order"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Dispute_orderId_idx" ON "Dispute"("orderId");
CREATE INDEX IF NOT EXISTS "Dispute_status_createdAt_idx" ON "Dispute"("status", "createdAt" DESC);

-- User.matricNumber was added to the schema out-of-band too; add the column
-- (guarded, since the live DB already has it) and its unique index.
DO $$ BEGIN
  BEGIN
    ALTER TABLE "User" ADD COLUMN "matricNumber" TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "User_matricNumber_key" ON "User"("matricNumber");

-- The Listing table drifted out-of-band from the init migration (nullable
-- categoryId/title/description/price and added draftStep/updatedAt). DROP NOT
-- NULL is a safe no-op on already-nullable columns, ADD COLUMN IF NOT EXISTS is
-- guarded -- the live DB already has the target shape.
ALTER TABLE "Listing" ALTER COLUMN "categoryId" DROP NOT NULL;
ALTER TABLE "Listing" ALTER COLUMN "title" DROP NOT NULL;
ALTER TABLE "Listing" ALTER COLUMN "description" DROP NOT NULL;
ALTER TABLE "Listing" ALTER COLUMN "price" DROP NOT NULL;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "draftStep" INTEGER;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Listing.sellerId/status/updatedAt index was added to the schema out-of-band.
CREATE INDEX IF NOT EXISTS "Listing_sellerId_status_updatedAt_idx" ON "Listing"("sellerId", "status", "updatedAt" DESC);

-- AddForeignKey (guarded)
DO $$ BEGIN
  BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

DO $$ BEGIN
  BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

DO $$ BEGIN
  BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

DO $$ BEGIN
  BEGIN
    ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

DO $$ BEGIN
  BEGIN
    ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

DO $$ BEGIN
  BEGIN
    ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;