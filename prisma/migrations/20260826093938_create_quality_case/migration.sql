-- CreateEnum
CREATE TYPE "QualityCaseStatus" AS ENUM ('DRAFT');

-- CreateTable
CREATE TABLE "QualityCase" (
    "id" TEXT NOT NULL,
    "status" "QualityCaseStatus" NOT NULL DEFAULT 'DRAFT',
    "problem" TEXT NOT NULL,
    "productionStage" TEXT,
    "productModelReference" TEXT,
    "material" TEXT,
    "machineWorkstation" TEXT,
    "batchOrderReference" TEXT,
    "additionalContextNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QualityCase_status_updatedAt_idx" ON "QualityCase"("status", "updatedAt");
