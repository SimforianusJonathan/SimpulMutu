import { describe, expect, it } from "vitest";

import {
  findRelevantPastCases,
  MAX_RELEVANT_PAST_CASES,
  type RetrievalCase,
} from "../../src/lib/relevant-past-cases/rules";
import { loadRelevantPastCaseReferences } from "../../src/lib/relevant-past-cases/service";
import { syntheticActiveQualityCaseFixture } from "../../src/lib/quality-case/synthetic-active-fixture";
import { syntheticResolvedQualityCaseFixtures } from "../../src/lib/quality-case/synthetic-resolved-fixtures";

function makeCase(
  id: string,
  overrides: Partial<RetrievalCase> = {},
): RetrievalCase {
  return {
    id,
    status: "RESOLVED",
    problem: "Jahitan loncat pada sisi samping produk",
    productionStage: "Penjahitan",
    productModelReference: null,
    material: "Cotton 24s",
    machineWorkstation: null,
    batchOrderReference: null,
    additionalContextNote: null,
    workingRootCause: "Dugaan historis.",
    evidence: [{ id: `${id}-e1`, content: "Bukti historis." }],
    contributingCauses: [
      {
        id: `${id}-c1`,
        content: "Faktor historis.",
        evidenceLinks: [{ evidenceId: `${id}-e1` }],
      },
    ],
    correctiveActions: [{ id: `${id}-a1`, content: "Tindakan historis." }],
    ...overrides,
  };
}

function fixtureToCase(
  fixture:
    | (typeof syntheticResolvedQualityCaseFixtures)[number]
    | typeof syntheticActiveQualityCaseFixture,
  status: RetrievalCase["status"],
): RetrievalCase {
  return {
    id: fixture.fixtureMarker,
    status,
    problem: fixture.problem,
    productionStage: fixture.productionStage,
    productModelReference: fixture.productModelReference ?? null,
    material: fixture.material ?? null,
    machineWorkstation: fixture.machineWorkstation ?? null,
    batchOrderReference: fixture.batchOrderReference ?? null,
    additionalContextNote: fixture.fixtureMarker,
    workingRootCause: fixture.workingRootCause,
    evidence: fixture.evidence.map((content, index) => ({
      id: fixture.fixtureMarker + "-e" + (index + 1),
      content,
    })),
    contributingCauses: fixture.contributingCauses.map((cause, index) => ({
      id: fixture.fixtureMarker + "-c" + (index + 1),
      content: cause.content,
      evidenceLinks: cause.evidenceIndexes.map((evidenceIndex) => ({
        evidenceId: fixture.fixtureMarker + "-e" + (evidenceIndex + 1),
      })),
    })),
    correctiveActions: fixture.correctiveActions.map((content, index) => ({
      id: fixture.fixtureMarker + "-a" + (index + 1),
      content,
    })),
  };
}

describe("retrieval Kasus Terdahulu yang Relevan", () => {
  it("menampilkan QC-001 dan QC-002 yang relevan walaupun dugaan historisnya berbeda", () => {
    const currentCase = makeCase("current", {
      status: "INVESTIGATING",
      problem: "Jahitan loncat kembali muncul pada sisi samping produk",
      workingRootCause: "Dugaan saat ini harus tetap mandiri.",
    });
    const needleCase = makeCase("qc-001", {
      workingRootCause: "Kondisi jarum diduga berkontribusi.",
    });
    const settingCase = makeCase("qc-002", {
      problem: "Jahitan tidak stabil setelah penyesuaian mesin penjahitan",
      workingRootCause: "Setting mesin diduga tidak sesuai.",
    });
    const irrelevantCase = makeCase("qc-003", {
      problem: "Hasil potong tidak konsisten pada lengan",
      productionStage: "Pemotongan",
      material: "Polyester",
    });

    const results = findRelevantPastCases(currentCase, [
      irrelevantCase,
      settingCase,
      needleCase,
    ]);

    expect(results.map((result) => result.id)).toEqual(["qc-001", "qc-002"]);
    expect(results[0]?.relevanceSignals).toEqual(
      expect.arrayContaining([
        "Tahap produksi sama",
        "Material sama",
        "Masalah kualitas serupa",
      ]),
    );
    expect(results[1]?.workingRootCause).not.toBe(currentCase.workingRootCause);
  });

  it("hanya memilih resolved case, membatasi tiga, dan menjaga urutan deterministik", () => {
    const currentCase = makeCase("current", { status: "INVESTIGATING" });
    const candidates = [
      makeCase("z"),
      makeCase("c"),
      makeCase("a"),
      makeCase("b"),
      makeCase("unresolved", { status: "INVESTIGATING" }),
    ];

    const first = findRelevantPastCases(currentCase, candidates);
    const second = findRelevantPastCases(currentCase, [...candidates].reverse());

    expect(first).toHaveLength(MAX_RELEVANT_PAST_CASES);
    expect(first.map((result) => result.id)).toEqual(["a", "b", "c"]);
    expect(second.map((result) => result.id)).toEqual(first.map((result) => result.id));
    expect(first).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "unresolved" })]),
    );
  });

  it("menghasilkan empty state untuk kandidat resolved yang tidak cukup relevan", () => {
    const currentCase = makeCase("current", {
      status: "INVESTIGATING",
      problem: "Jahitan loncat pada sisi samping produk",
      productionStage: "Penjahitan",
      material: "Cotton 24s",
    });
    const unrelatedCase = makeCase("cutting", {
      problem: "Hasil potong tidak konsisten pada lengan",
      productionStage: "Pemotongan",
      material: "Polyester",
    });

    expect(findRelevantPastCases(currentCase, [unrelatedCase])).toEqual([]);
  });

  it("memilih kecocokan konteks terstruktur yang kuat daripada Masalah mirip dengan konteks bertentangan", () => {
    const currentCase = makeCase("current", { status: "INVESTIGATING" });
    const lexicalOnly = makeCase("lexical-only", {
      problem: currentCase.problem,
      productionStage: "Pemotongan",
      material: "Polyester",
    });
    const structuredMatch = makeCase("structured-match", {
      problem: "Ukuran jahitan berubah setelah penyesuaian mesin.",
    });

    expect(
      findRelevantPastCases(currentCase, [lexicalOnly, structuredMatch]).map(
        (result) => result.id,
      ),
    ).toEqual(["structured-match"]);
  });

  it("memenuhi inklusi dan eksklusi fixture M4 yang sebenarnya", () => {
    const currentCase = fixtureToCase(
      syntheticActiveQualityCaseFixture,
      "INVESTIGATING",
    );
    const results = findRelevantPastCases(
      currentCase,
      syntheticResolvedQualityCaseFixtures.map((fixture) =>
        fixtureToCase(fixture, "RESOLVED"),
      ),
    );

    expect(results.map((result) => result.id)).toEqual([
      "synthetic-m4-qc-001",
      "synthetic-m4-qc-002",
    ]);
    expect(results).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "synthetic-m4-qc-003" }),
      ]),
    );
  });

  it("menjelaskan hanya sinyal yang benar-benar sama dan tidak memutasi kasus saat ini", () => {
    const currentCase = makeCase("current", {
      status: "INVESTIGATING",
      problem: "Masalah jahitan berbeda",
      productionStage: "Penjahitan",
      material: "Cotton 24s",
      workingRootCause: "Dugaan akar saat ini.",
      correctiveActions: [{ id: "current-a", content: "Tindakan saat ini." }],
    });
    const snapshot = structuredClone(currentCase);
    const historicalCase = makeCase("history", {
      problem: "Potongan berbeda pada lengan",
      productionStage: "Penjahitan",
      material: "Cotton 24s",
      machineWorkstation: "M-04",
    });

    const [result] = findRelevantPastCases(currentCase, [historicalCase]);

    expect(result?.relevanceSignals).toEqual([
      "Tahap produksi sama",
      "Material sama",
    ]);
    expect(currentCase).toEqual(snapshot);
  });

  it("membuat state referensi tidak tersedia tanpa menghambat investigasi saat retrieval gagal", async () => {
    await expect(
      loadRelevantPastCaseReferences("current", async () => {
        throw new Error("PostgreSQL tidak tersedia");
      }),
    ).resolves.toEqual({ results: [], referencesUnavailable: true });
  });
});
