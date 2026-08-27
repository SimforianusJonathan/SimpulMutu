import { QualityCaseStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";

import {
  findRelevantPastCases,
  type RelevantPastCase,
  type RetrievalCase,
} from "./rules";

export type RelevantPastCaseReferences = {
  results: RelevantPastCase[];
  referencesUnavailable: boolean;
};

const retrievalCaseInclude = {
  evidence: {
    orderBy: { createdAt: "asc" as const },
    select: { id: true, content: true },
  },
  contributingCauses: {
    orderBy: { createdAt: "asc" as const },
    select: {
      id: true,
      content: true,
      evidenceLinks: { select: { evidenceId: true } },
    },
  },
  correctiveActions: {
    orderBy: { createdAt: "asc" as const },
    select: { id: true, content: true },
  },
};

export async function getRelevantPastCases(
  qualityCaseId: string,
): Promise<RelevantPastCase[]> {
  const currentCase = await getPrisma().qualityCase.findFirst({
    where: {
      id: qualityCaseId,
      status: {
        in: [QualityCaseStatus.DRAFT, QualityCaseStatus.INVESTIGATING],
      },
    },
    include: retrievalCaseInclude,
  });

  if (!currentCase) return [];

  const historicalCases = await getPrisma().qualityCase.findMany({
    where: {
      id: { not: qualityCaseId },
      status: QualityCaseStatus.RESOLVED,
    },
    include: retrievalCaseInclude,
  });

  return findRelevantPastCases(
    currentCase as RetrievalCase,
    historicalCases as RetrievalCase[],
  );
}

export async function loadRelevantPastCaseReferences(
  qualityCaseId: string,
  retrieve: (id: string) => Promise<RelevantPastCase[]> = getRelevantPastCases,
): Promise<RelevantPastCaseReferences> {
  try {
    return {
      results: await retrieve(qualityCaseId),
      referencesUnavailable: false,
    };
  } catch {
    return { results: [], referencesUnavailable: true };
  }
}
