-- CreateTable
CREATE TABLE "ContributingCause" (
    "id" TEXT NOT NULL,
    "qualityCaseId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributingCause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceCauseLink" (
    "evidenceId" TEXT NOT NULL,
    "contributingCauseId" TEXT NOT NULL,

    CONSTRAINT "EvidenceCauseLink_pkey" PRIMARY KEY ("evidenceId","contributingCauseId")
);

-- CreateIndex
CREATE INDEX "ContributingCause_qualityCaseId_createdAt_idx" ON "ContributingCause"("qualityCaseId", "createdAt");

-- CreateIndex
CREATE INDEX "EvidenceCauseLink_contributingCauseId_idx" ON "EvidenceCauseLink"("contributingCauseId");

-- AddForeignKey
ALTER TABLE "ContributingCause" ADD CONSTRAINT "ContributingCause_qualityCaseId_fkey" FOREIGN KEY ("qualityCaseId") REFERENCES "QualityCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceCauseLink" ADD CONSTRAINT "EvidenceCauseLink_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceCauseLink" ADD CONSTRAINT "EvidenceCauseLink_contributingCauseId_fkey" FOREIGN KEY ("contributingCauseId") REFERENCES "ContributingCause"("id") ON DELETE CASCADE ON UPDATE CASCADE;
