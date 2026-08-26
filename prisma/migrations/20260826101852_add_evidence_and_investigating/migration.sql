-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QualityCaseStatus" ADD VALUE 'INVESTIGATING';
ALTER TYPE "QualityCaseStatus" ADD VALUE 'RESOLVED';

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "qualityCaseId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Evidence_qualityCaseId_createdAt_idx" ON "Evidence"("qualityCaseId", "createdAt");

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_qualityCaseId_fkey" FOREIGN KEY ("qualityCaseId") REFERENCES "QualityCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
