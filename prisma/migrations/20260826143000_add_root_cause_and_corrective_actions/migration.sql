ALTER TABLE "QualityCase"
ADD COLUMN "workingRootCause" TEXT;

CREATE TABLE "CorrectiveAction" (
    "id" TEXT NOT NULL,
    "qualityCaseId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectiveAction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CorrectiveAction_qualityCaseId_createdAt_idx"
ON "CorrectiveAction"("qualityCaseId", "createdAt");

ALTER TABLE "CorrectiveAction"
ADD CONSTRAINT "CorrectiveAction_qualityCaseId_fkey"
FOREIGN KEY ("qualityCaseId") REFERENCES "QualityCase"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
