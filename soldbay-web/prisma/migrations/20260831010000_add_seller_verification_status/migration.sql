-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "verificationAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING';
