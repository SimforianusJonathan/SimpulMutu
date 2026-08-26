export type ResolutionReadinessInput = {
  problem: string;
  evidenceCount: number;
  contributingCauseEvidenceCounts: readonly number[];
  workingRootCause: string | null;
  correctiveActionCount: number;
};

export function getResolutionReadiness(input: ResolutionReadinessInput) {
  const requirements = [
    { key: "masalah", label: "Masalah", complete: input.problem.trim().length > 0 },
    { key: "bukti", label: "Bukti", complete: input.evidenceCount > 0 },
    {
      key: "faktor",
      label: "Faktor Penyebab",
      complete: input.contributingCauseEvidenceCounts.length > 0,
    },
    {
      key: "akar",
      label: "Dugaan Akar Penyebab",
      complete: Boolean(input.workingRootCause?.trim()),
    },
    {
      key: "tindakan",
      label: "Tindakan Korektif",
      complete: input.correctiveActionCount > 0,
    },
  ] as const;

  return {
    complete: requirements.every((requirement) => requirement.complete),
    requirements,
  };
}

export function getStageCompleteness(
  problem: string,
  evidenceCount: number,
  contributingCauseEvidenceCounts: readonly number[] = [],
  workingRootCause: string | null = null,
  correctiveActionCount = 0,
) {
  const readiness = getResolutionReadiness({
    problem,
    evidenceCount,
    contributingCauseEvidenceCounts,
    workingRootCause,
    correctiveActionCount,
  });

  return {
    masalah: readiness.requirements[0].complete,
    bukti: readiness.requirements[1].complete,
    faktor:
      contributingCauseEvidenceCounts.length > 0 &&
      contributingCauseEvidenceCounts.every((count) => count > 0),
    akar: readiness.requirements[3].complete,
    tindakan: readiness.requirements[4].complete,
    ringkasan: false,
  };
}
