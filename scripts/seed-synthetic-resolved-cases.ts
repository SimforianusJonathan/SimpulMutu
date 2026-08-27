import "dotenv/config";

import { disconnectDatabase, getPrisma } from "@/lib/db/prisma";
import {
  addContributingCause,
  addCorrectiveAction,
  addEvidence,
  createQualityCase,
  resolveQualityCase,
  updateWorkingRootCause,
} from "@/lib/quality-case/service";
import {
  syntheticResolvedQualityCaseFixtures,
  type SyntheticResolvedQualityCaseFixture,
} from "@/lib/quality-case/synthetic-resolved-fixtures";

async function seedFixture(fixture: SyntheticResolvedQualityCaseFixture) {
  const existing = await getPrisma().qualityCase.findFirst({
    where: { additionalContextNote: fixture.fixtureMarker },
    select: { id: true, status: true },
  });
  if (existing) {
    console.info(`Melewati ${fixture.label}; kasus sintetis sudah ada (${existing.status}).`);
    return;
  }

  const qualityCase = await createQualityCase({
    problem: fixture.problem,
    productionStage: fixture.productionStage,
    productModelReference: fixture.productModelReference,
    material: fixture.material,
    machineWorkstation: fixture.machineWorkstation,
    batchOrderReference: fixture.batchOrderReference,
    additionalContextNote: fixture.fixtureMarker,
  });
  const evidence: { id: string }[] = [];
  for (const content of fixture.evidence) {
    evidence.push(await addEvidence(qualityCase.id, content));
  }
  for (const cause of fixture.contributingCauses) {
    await addContributingCause(
      qualityCase.id,
      cause.content,
      cause.evidenceIndexes.map((index) => evidence[index]?.id).filter(
        (id): id is string => Boolean(id),
      ),
    );
  }
  await updateWorkingRootCause(qualityCase.id, fixture.workingRootCause);
  for (const content of fixture.correctiveActions) {
    await addCorrectiveAction(qualityCase.id, content);
  }
  await resolveQualityCase(qualityCase.id);
  console.info(`Membuat ${fixture.label} sebagai Memori Kualitas sintetis.`);
}

try {
  for (const fixture of syntheticResolvedQualityCaseFixtures) {
    await seedFixture(fixture);
  }
} finally {
  await disconnectDatabase();
}
