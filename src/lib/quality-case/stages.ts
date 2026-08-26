export function getStageCompleteness(
  problem: string,
  evidenceCount: number,
  contributingCauseEvidenceCounts: readonly number[] = [],
) {
  return {
    masalah: problem.trim().length > 0,
    bukti: evidenceCount > 0,
    faktor:
      contributingCauseEvidenceCounts.length > 0 &&
      contributingCauseEvidenceCounts.every((count) => count > 0),
    akar: false,
    tindakan: false,
    ringkasan: false,
  };
}
