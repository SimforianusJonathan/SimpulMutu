import "dotenv/config";

import { disconnectDatabase, getPrisma } from "@/lib/db/prisma";
import {
  addContributingCause,
  addCorrectiveAction,
  addEvidence,
  createQualityCase,
  updateWorkingRootCause,
} from "@/lib/quality-case/service";
import { syntheticActiveQualityCaseFixture } from "@/lib/quality-case/synthetic-active-fixture";

const reset = process.argv.includes("--reset");

try {
  const existing = await getPrisma().qualityCase.findFirst({
    where: {
      additionalContextNote: syntheticActiveQualityCaseFixture.fixtureMarker,
    },
    select: { id: true, status: true },
  });
  if (existing && reset) {
    await getPrisma().qualityCase.delete({ where: { id: existing.id } });
    console.info(
      `Mengatur ulang ${syntheticActiveQualityCaseFixture.label}; fixture sintetis lama (${existing.status}) dihapus.`,
    );
  }

  if (existing && !reset) {
    console.info(
      `Melewati ${syntheticActiveQualityCaseFixture.label}; kasus sintetis sudah ada (${existing.status}).`,
    );
  } else {
    const qualityCase = await createQualityCase({
      problem: syntheticActiveQualityCaseFixture.problem,
      productionStage: syntheticActiveQualityCaseFixture.productionStage,
      productModelReference:
        syntheticActiveQualityCaseFixture.productModelReference,
      material: syntheticActiveQualityCaseFixture.material,
      machineWorkstation: syntheticActiveQualityCaseFixture.machineWorkstation,
      batchOrderReference: syntheticActiveQualityCaseFixture.batchOrderReference,
      additionalContextNote: syntheticActiveQualityCaseFixture.fixtureMarker,
    });
    const evidence: { id: string }[] = [];
    for (const content of syntheticActiveQualityCaseFixture.evidence) {
      evidence.push(await addEvidence(qualityCase.id, content));
    }
    for (const cause of syntheticActiveQualityCaseFixture.contributingCauses) {
      await addContributingCause(
        qualityCase.id,
        cause.content,
        cause.evidenceIndexes.map((index) => evidence[index]?.id).filter(
          (id): id is string => Boolean(id),
        ),
      );
    }
    await updateWorkingRootCause(
      qualityCase.id,
      syntheticActiveQualityCaseFixture.workingRootCause,
    );
    for (const content of syntheticActiveQualityCaseFixture.correctiveActions) {
      await addCorrectiveAction(qualityCase.id, content);
    }
    console.info(
      `Membuat ${syntheticActiveQualityCaseFixture.label} sebagai Kasus Kualitas aktif sintetis.`,
    );
  }
} finally {
  await disconnectDatabase();
}
