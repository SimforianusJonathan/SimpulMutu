export const MAX_RELEVANT_PAST_CASES = 3;

const stopWords = new Set([
  "ada",
  "adalah",
  "atau",
  "beberapa",
  "dalam",
  "dan",
  "dengan",
  "di",
  "dari",
  "hasil",
  "ke",
  "pada",
  "produk",
  "proses",
  "setelah",
  "tidak",
  "untuk",
  "yang",
]);

export type RelevanceSignal =
  | "Tahap produksi sama"
  | "Produk / referensi model sama"
  | "Material sama"
  | "Mesin / workstation sama"
  | "Referensi batch / order sama"
  | "Masalah kualitas serupa";

export type RetrievalCase = {
  id: string;
  status: "DRAFT" | "INVESTIGATING" | "RESOLVED";
  problem: string;
  productionStage: string | null;
  productModelReference: string | null;
  material: string | null;
  machineWorkstation: string | null;
  batchOrderReference: string | null;
  additionalContextNote: string | null;
  workingRootCause: string | null;
  evidence: { id: string; content: string }[];
  contributingCauses: {
    id: string;
    content: string;
    evidenceLinks: { evidenceId: string }[];
  }[];
  correctiveActions: { id: string; content: string }[];
};

export type RelevantPastCase = RetrievalCase & {
  relevanceSignals: RelevanceSignal[];
};

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("id-ID")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function valuesMatch(left: string | null, right: string | null) {
  return Boolean(left && right && normalize(left) === normalize(right));
}

function problemIsSimilar(left: string, right: string) {
  const leftTokens = new Set(
    normalize(left)
      .split(" ")
      .filter((token) => token.length > 2 && !stopWords.has(token)),
  );
  const sharedTokens = normalize(right)
    .split(" ")
    .filter((token) => leftTokens.has(token));

  return new Set(sharedTokens).size >= 2;
}

export function getRelevanceSignals(
  currentCase: RetrievalCase,
  historicalCase: RetrievalCase,
): RelevanceSignal[] {
  const signals: RelevanceSignal[] = [];

  if (valuesMatch(currentCase.productionStage, historicalCase.productionStage)) {
    signals.push("Tahap produksi sama");
  }
  if (
    valuesMatch(
      currentCase.productModelReference,
      historicalCase.productModelReference,
    )
  ) {
    signals.push("Produk / referensi model sama");
  }
  if (valuesMatch(currentCase.material, historicalCase.material)) {
    signals.push("Material sama");
  }
  if (
    valuesMatch(currentCase.machineWorkstation, historicalCase.machineWorkstation)
  ) {
    signals.push("Mesin / workstation sama");
  }
  if (
    valuesMatch(currentCase.batchOrderReference, historicalCase.batchOrderReference)
  ) {
    signals.push("Referensi batch / order sama");
  }
  if (problemIsSimilar(currentCase.problem, historicalCase.problem)) {
    signals.push("Masalah kualitas serupa");
  }

  return signals;
}

export function findRelevantPastCases(
  currentCase: RetrievalCase,
  candidates: readonly RetrievalCase[],
): RelevantPastCase[] {
  return candidates
    .filter(
      (candidate) =>
        candidate.status === "RESOLVED" && candidate.id !== currentCase.id,
    )
    .map((candidate) => ({
      ...candidate,
      relevanceSignals: getRelevanceSignals(currentCase, candidate),
    }))
    .filter((candidate) => candidate.relevanceSignals.length >= 2)
    .sort((left, right) => {
      const signalDifference =
        right.relevanceSignals.length - left.relevanceSignals.length;
      return signalDifference !== 0
        ? signalDifference
        : left.id.localeCompare(right.id);
    })
    .slice(0, MAX_RELEVANT_PAST_CASES);
}
