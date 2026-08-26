import { describe, expect, it } from "vitest";

import { validateQualityCaseInput } from "../../src/lib/quality-case/input";
import { initialQualityCaseStatus } from "../../src/lib/quality-case/service";

describe("validasi Kasus Kualitas", () => {
  it("memulai Kasus Kualitas sebagai DRAFT, bukan Memori Kualitas", () => {
    expect(initialQualityCaseStatus()).toBe("DRAFT");
  });
  it("menolak Masalah yang kosong", () => {
    expect(validateQualityCaseInput({ problem: "   " })).toEqual({
      ok: false,
      error: "Masalah perlu diisi sebelum Kasus Kualitas disimpan.",
    });
  });

  it("membuat konteks tambahan tetap opsional", () => {
    expect(validateQualityCaseInput({ problem: "Jahitan sisi terlepas" })).toEqual({
      ok: true,
      value: {
        problem: "Jahitan sisi terlepas",
        productionStage: null,
        productModelReference: null,
        material: null,
        machineWorkstation: null,
        batchOrderReference: null,
        additionalContextNote: null,
      },
    });
  });

  it("menormalisasi konteks yang tersedia tanpa membuat placeholder", () => {
    const result = validateQualityCaseInput({
      problem: "  Ukuran potongan tidak konsisten  ",
      productionStage: "  Pemotongan ",
      material: "   ",
    });

    expect(result).toEqual({
      ok: true,
      value: expect.objectContaining({
        problem: "Ukuran potongan tidak konsisten",
        productionStage: "Pemotongan",
        material: null,
      }),
    });
  });
});