export function getStageCompleteness(problem: string, evidenceCount: number) {
  return { masalah: problem.trim().length > 0, bukti: evidenceCount > 0, faktor: false, akar: false, tindakan: false, ringkasan: false };
}