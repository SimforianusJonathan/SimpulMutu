export type QualityCaseInput = {
  problem: string;
  productionStage?: string | null;
  productModelReference?: string | null;
  material?: string | null;
  machineWorkstation?: string | null;
  batchOrderReference?: string | null;
  additionalContextNote?: string | null;
};

export type QualityCaseInputValidation =
  | { ok: true; value: QualityCaseInput }
  | { ok: false; error: string };

function optionalText(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function validateQualityCaseInput(input: QualityCaseInput): QualityCaseInputValidation {
  const problem = input.problem.trim();

  if (!problem) {
    return { ok: false, error: "Masalah perlu diisi sebelum Kasus Kualitas disimpan." };
  }

  return {
    ok: true,
    value: {
      problem,
      productionStage: optionalText(input.productionStage),
      productModelReference: optionalText(input.productModelReference),
      material: optionalText(input.material),
      machineWorkstation: optionalText(input.machineWorkstation),
      batchOrderReference: optionalText(input.batchOrderReference),
      additionalContextNote: optionalText(input.additionalContextNote),
    },
  };
}

export function qualityCaseInputFromFormData(formData: FormData): QualityCaseInput {
  const value = (name: string): string => {
    const submitted = formData.get(name);
    return typeof submitted === "string" ? submitted : "";
  };

  return {
    problem: value("problem"),
    productionStage: value("productionStage"),
    productModelReference: value("productModelReference"),
    material: value("material"),
    machineWorkstation: value("machineWorkstation"),
    batchOrderReference: value("batchOrderReference"),
    additionalContextNote: value("additionalContextNote"),
  };
}