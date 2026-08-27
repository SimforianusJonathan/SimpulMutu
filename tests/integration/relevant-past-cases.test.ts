import "dotenv/config";

import { afterAll, afterEach, describe, expect, it } from "vitest";

import { disconnectDatabase, getPrisma } from "../../src/lib/db/prisma";
import {
  addContributingCause,
  addCorrectiveAction,
  addEvidence,
  createQualityCase,
  resolveQualityCase,
  updateWorkingRootCause,
} from "../../src/lib/quality-case/service";
import { getRelevantPastCases } from "../../src/lib/relevant-past-cases/service";

const createdIds: string[] = [];

afterEach(async () => {
  await getPrisma().qualityCase.deleteMany({
    where: { id: { in: createdIds.splice(0) } },
  });
});

afterAll(async () => {
  await disconnectDatabase();
});

async function createResolvedCase(input: {
  problem: string;
  productionStage: string;
  material: string;
  machineWorkstation?: string;
  rootCause: string;
}) {
  const qualityCase = await createQualityCase(input);
  createdIds.push(qualityCase.id);
  const evidence = await addEvidence(qualityCase.id, "Bukti historis.");
  await addContributingCause(qualityCase.id, "Faktor historis.", [evidence.id]);
  await updateWorkingRootCause(qualityCase.id, input.rootCause);
  await addCorrectiveAction(qualityCase.id, "Tindakan historis.");
  await resolveQualityCase(qualityCase.id);
  return qualityCase;
}

describe("retrieval canonical PostgreSQL", () => {
  it("membaca resolved case baru dari PostgreSQL tanpa secondary index dan mengecualikan case aktif", async () => {
    const currentCase = await createQualityCase({
      problem: "Jahitan loncat kembali muncul pada sisi samping produk",
      productionStage: "Penjahitan",
      material: "Cotton 24s",
      machineWorkstation: "M-07",
    });
    createdIds.push(currentCase.id);

    const matchingCase = await createResolvedCase({
      problem: "Jahitan loncat pada sisi samping beberapa produk",
      productionStage: "Penjahitan",
      material: "Cotton 24s",
      machineWorkstation: "M-04",
      rootCause: "Kondisi jarum diduga berkontribusi.",
    });
    const unrelatedResolvedCase = await createResolvedCase({
      problem: "Hasil potong tidak konsisten pada bagian lengan",
      productionStage: "Pemotongan",
      material: "Polyester",
      rootCause: "Pola pemotongan diduga bergeser.",
    });
    const unresolvedSimilarCase = await createQualityCase({
      problem: "Jahitan loncat pada sisi samping beberapa produk",
      productionStage: "Penjahitan",
      material: "Cotton 24s",
    });
    createdIds.push(unresolvedSimilarCase.id);

    const results = await getRelevantPastCases(currentCase.id);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: matchingCase.id,
          relevanceSignals: expect.arrayContaining([
            "Tahap produksi sama",
            "Material sama",
          ]),
        }),
      ]),
    );
    expect(results).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: unrelatedResolvedCase.id }),
        expect.objectContaining({ id: unresolvedSimilarCase.id }),
        expect.objectContaining({ id: currentCase.id }),
      ]),
    );
    expect(results.length).toBeLessThanOrEqual(3);
  });
});
