-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_universityId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "universityId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SellerProfile_username_key" ON "SellerProfile"("username");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;
