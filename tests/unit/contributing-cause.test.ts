import { describe, expect, it } from "vitest";

import {
  normalizeEvidenceIds,
  validateContributingCauseContent,
} from "../../src/lib/quality-case/service";
import { getStageCompleteness } from "../../src/lib/quality-case/stages";

describe("Faktor Penyebab dan hubungan Bukti", () => {
  it("mengizinkan lebih dari satu Faktor Penyebab", () => {
    const causes = [
      validateContributingCauseContent("Tegangan benang mungkin berkontribusi"),
      validateContributingCauseContent("Kondisi jarum perlu diperiksa"),
    ];

    expect(causes).toHaveLength(2);
  });

  it("menolak Faktor Penyebab kosong", () => {
    expect(() => validateContributingCauseContent("  ")).toThrow(
      "Faktor Penyebab perlu diisi",
    );
  });

  it("menormalisasi link dan mempertahankan many-to-many tanpa duplikasi", () => {
    const evidenceOneToMany = {
      E1: ["C1", "C2"],
    };
    const manyEvidenceToOne = {
      C1: normalizeEvidenceIds(["E1", "E2", "E1"]),
    };

    expect(evidenceOneToMany.E1).toEqual(["C1", "C2"]);
    expect(manyEvidenceToOne.C1).toEqual(["E1", "E2"]);
  });

  it("menganggap tahap Faktor lengkap hanya jika setiap faktor memiliki Bukti", () => {
    expect(getStageCompleteness("Masalah", 2, [2, 1]).faktor).toBe(true);
    expect(getStageCompleteness("Masalah", 2, [1, 0]).faktor).toBe(false);
    expect(getStageCompleteness("Masalah", 2, []).faktor).toBe(false);
  });

  it("memaknai link sebagai dukungan investigasi, bukan akar penyebab", () => {
    const relationship = {
      evidenceId: "E1",
      contributingCauseId: "C1",
    };

    expect(relationship).toEqual({
      evidenceId: "E1",
      contributingCauseId: "C1",
    });
    expect(relationship).not.toHaveProperty("rootCause");
    expect(relationship).not.toHaveProperty("confidence");
  });
});
