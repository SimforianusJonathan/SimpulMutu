import { describe, expect, it } from "vitest";

import {
  validateCorrectiveActionContent,
  validateWorkingRootCauseContent,
} from "../../src/lib/quality-case/service";
import {
  getResolutionReadiness,
  getStageCompleteness,
} from "../../src/lib/quality-case/stages";

const completeInput = {
  problem: "Jahitan sisi terlepas",
  evidenceCount: 1,
  contributingCauseEvidenceCounts: [1],
  workingRootCause: "Tegangan benang perlu distabilkan.",
  correctiveActionCount: 1,
};

describe("Dugaan Akar Penyebab dan Tindakan Korektif", () => {
  it("menyimpan satu representasi Dugaan Akar Penyebab untuk kesiapan", () => {
    const firstConclusion = validateWorkingRootCauseContent(
      "Jarum aus perlu diganti.",
    );
    const revisedConclusion = validateWorkingRootCauseContent(
      "Tegangan benang perlu distabilkan.",
    );

    expect(firstConclusion).not.toBe(revisedConclusion);
    expect(
      getResolutionReadiness({
        ...completeInput,
        workingRootCause: revisedConclusion,
      }).requirements.find((requirement) => requirement.key === "akar")?.complete,
    ).toBe(true);
  });

  it("menolak Dugaan Akar Penyebab dan Tindakan Korektif kosong", () => {
    expect(() => validateWorkingRootCauseContent("  ")).toThrow(
      "Dugaan Akar Penyebab perlu diisi",
    );
    expect(() => validateCorrectiveActionContent("  ")).toThrow(
      "Tindakan Korektif perlu diisi",
    );
  });

  it("mengizinkan lebih dari satu Tindakan Korektif", () => {
    const actions = [
      validateCorrectiveActionContent("Atur ulang tegangan benang."),
      validateCorrectiveActionContent("Ganti jarum yang aus."),
    ];

    expect(actions).toHaveLength(2);
  });

  it.each([
    ["Masalah", { problem: "  " }],
    ["Bukti", { evidenceCount: 0 }],
    ["Faktor Penyebab", { contributingCauseEvidenceCounts: [] }],
    ["Dugaan Akar Penyebab", { workingRootCause: null }],
    ["Tindakan Korektif", { correctiveActionCount: 0 }],
  ])("menandai kesiapan belum lengkap ketika %s belum tersedia", (_label, change) => {
    expect(getResolutionReadiness({ ...completeInput, ...change }).complete).toBe(false);
  });

  it("tidak menjadikan hubungan Bukti tambahan sebagai syarat readiness", () => {
    expect(
      getResolutionReadiness({
        ...completeInput,
        contributingCauseEvidenceCounts: [0],
      }).complete,
    ).toBe(true);
    expect(getStageCompleteness("Masalah", 1, [0]).faktor).toBe(false);
  });

  it("menandai kesiapan lengkap hanya ketika seluruh invariant tersedia", () => {
    const before = structuredClone(completeInput);
    const readiness = getResolutionReadiness(completeInput);

    expect(readiness.complete).toBe(true);
    expect(readiness.requirements).toHaveLength(5);
    expect(completeInput).toEqual(before);
  });

  it("tidak menambah confidence atau verification semantics", () => {
    const readiness = getResolutionReadiness(completeInput);

    expect(readiness).not.toHaveProperty("confidence");
    expect(readiness).not.toHaveProperty("verification");
    expect(readiness).not.toHaveProperty("status");
  });
});
