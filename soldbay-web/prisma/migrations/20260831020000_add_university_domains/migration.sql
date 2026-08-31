-- AlterTable
ALTER TABLE "University" ADD COLUMN     "domains" TEXT[] DEFAULT ARRAY[]::TEXT[];
