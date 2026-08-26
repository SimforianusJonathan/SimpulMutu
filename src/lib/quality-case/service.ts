import { QualityCaseStatus, type Prisma } from "@/generated/prisma/client";

import { getPrisma } from "@/lib/db/prisma";
import { type QualityCaseInput, validateQualityCaseInput } from "./input";
import { getResolutionReadiness } from "./stages";

const activeStatuses: QualityCaseStatus[] = [
  QualityCaseStatus.DRAFT,
  QualityCaseStatus.INVESTIGATING,
];

const qualityCaseInclude = {
  evidence: {
    orderBy: { createdAt: "asc" as const },
    include: { causeLinks: { select: { contributingCauseId: true } } },
  },
  contributingCauses: {
    orderBy: { createdAt: "asc" as const },
    include: { evidenceLinks: { select: { evidenceId: true } } },
  },
  correctiveActions: {
    orderBy: { createdAt: "asc" as const },
  },
};

export function initialQualityCaseStatus() {
  return QualityCaseStatus.DRAFT;
}

export class QualityCaseNotFoundError extends Error {
  constructor() {
    super("Kasus Kualitas tidak ditemukan atau tidak lagi aktif.");
    this.name = "QualityCaseNotFoundError";
  }
}

export class QualityCaseResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QualityCaseResolutionError";
  }
}

export class InvalidEvidenceSelectionError extends Error {
  constructor() {
    super("Pilihan Bukti tidak valid untuk Kasus Kualitas ini.");
    this.name = "InvalidEvidenceSelectionError";
  }
}

function validateRequiredContent(content: string, label: string) {
  const normalized = content.trim();
  if (!normalized) throw new Error(`${label} perlu diisi sebelum disimpan.`);
  return normalized;
}

export function validateEvidenceContent(content: string) {
  return validateRequiredContent(content, "Bukti");
}

export function validateContributingCauseContent(content: string) {
  return validateRequiredContent(content, "Faktor Penyebab");
}

export function validateWorkingRootCauseContent(content: string) {
  return validateRequiredContent(content, "Dugaan Akar Penyebab");
}

export function validateCorrectiveActionContent(content: string) {
  return validateRequiredContent(content, "Tindakan Korektif");
}

export function normalizeEvidenceIds(evidenceIds: readonly string[]) {
  return Array.from(new Set(evidenceIds.map((id) => id.trim()).filter(Boolean)));
}

export async function createQualityCase(input: QualityCaseInput) {
  const validation = validateQualityCaseInput(input);
  if (!validation.ok) throw new Error(validation.error);

  return getPrisma().qualityCase.create({
    data: { ...validation.value, status: initialQualityCaseStatus() },
  });
}

export async function updateActiveQualityCase(id: string, input: QualityCaseInput) {
  const validation = validateQualityCaseInput(input);
  if (!validation.ok) throw new Error(validation.error);

  const result = await getPrisma().qualityCase.updateMany({
    where: { id, status: { in: activeStatuses } },
    data: validation.value,
  });
  if (result.count !== 1) throw new QualityCaseNotFoundError();

  return getActiveQualityCase(id);
}

export async function getQualityCase(id: string) {
  return getPrisma().qualityCase.findUnique({
    where: { id },
    include: qualityCaseInclude,
  });
}

export async function listResolvedQualityCases() {
  return getPrisma().qualityCase.findMany({
    where: { status: QualityCaseStatus.RESOLVED },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getActiveQualityCase(id: string) {
  return getPrisma().qualityCase.findFirst({
    where: { id, status: { in: activeStatuses } },
    include: qualityCaseInclude,
  });
}

export async function listActiveQualityCases() {
  return getPrisma().qualityCase.findMany({
    where: { status: { in: activeStatuses } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function addEvidence(id: string, content: string) {
  const normalized = validateEvidenceContent(content);

  return getPrisma().$transaction(async (tx) => {
    const updated = await tx.qualityCase.updateMany({
      where: { id, status: { in: activeStatuses } },
      data: { status: QualityCaseStatus.INVESTIGATING },
    });
    if (updated.count !== 1) throw new QualityCaseNotFoundError();

    return tx.evidence.create({
      data: { qualityCaseId: id, content: normalized },
    });
  });
}

export async function updateEvidence(id: string, evidenceId: string, content: string) {
  const normalized = validateEvidenceContent(content);

  return getPrisma().$transaction(async (tx) => {
    await lockActiveQualityCase(tx, id);
    const result = await tx.evidence.updateMany({
      where: { id: evidenceId, qualityCaseId: id },
      data: { content: normalized },
    });
    if (result.count !== 1) throw new QualityCaseNotFoundError();
  });
}

export async function removeEvidence(id: string, evidenceId: string) {
  return getPrisma().$transaction(async (tx) => {
    await lockActiveQualityCase(tx, id);
    const result = await tx.evidence.deleteMany({
      where: { id: evidenceId, qualityCaseId: id },
    });
    if (result.count !== 1) throw new QualityCaseNotFoundError();
  });
}

type LockedQualityCase = {
  status: QualityCaseStatus;
  problem: string;
  workingRootCause: string | null;
};

async function lockQualityCase(
  tx: Prisma.TransactionClient,
  qualityCaseId: string,
) {
  const [qualityCase] = await tx.$queryRaw<LockedQualityCase[]>`
    SELECT "status", "problem", "workingRootCause"
    FROM "QualityCase"
    WHERE "id" = ${qualityCaseId}
    FOR UPDATE
  `;
  if (!qualityCase) {
    throw new QualityCaseNotFoundError();
  }

  return qualityCase;
}

async function lockActiveQualityCase(
  tx: Prisma.TransactionClient,
  qualityCaseId: string,
) {
  const qualityCase = await lockQualityCase(tx, qualityCaseId);
  if (!activeStatuses.includes(qualityCase.status)) {
    throw new QualityCaseNotFoundError();
  }

  return qualityCase;
}

async function assertEvidenceSelection(
  tx: Prisma.TransactionClient,
  qualityCaseId: string,
  evidenceIds: string[],
) {
  await lockActiveQualityCase(tx, qualityCaseId);
  const evidenceCount = await tx.evidence.count({
    where: { qualityCaseId, id: { in: evidenceIds } },
  });
  if (evidenceCount !== evidenceIds.length) {
    throw new InvalidEvidenceSelectionError();
  }
}

export async function addContributingCause(
  qualityCaseId: string,
  content: string,
  selectedEvidenceIds: readonly string[],
) {
  const normalized = validateContributingCauseContent(content);
  const evidenceIds = normalizeEvidenceIds(selectedEvidenceIds);

  return getPrisma().$transaction(async (tx) => {
    await assertEvidenceSelection(tx, qualityCaseId, evidenceIds);
    await tx.qualityCase.update({
      where: { id: qualityCaseId },
      data: { status: QualityCaseStatus.INVESTIGATING },
    });

    return tx.contributingCause.create({
      data: {
        qualityCaseId,
        content: normalized,
        evidenceLinks: {
          create: evidenceIds.map((evidenceId) => ({ evidenceId })),
        },
      },
      include: { evidenceLinks: true },
    });
  });
}

export async function updateContributingCause(
  qualityCaseId: string,
  causeId: string,
  content: string,
  selectedEvidenceIds: readonly string[],
) {
  const normalized = validateContributingCauseContent(content);
  const evidenceIds = normalizeEvidenceIds(selectedEvidenceIds);

  return getPrisma().$transaction(async (tx) => {
    const cause = await tx.contributingCause.findFirst({
      where: {
        id: causeId,
        qualityCaseId,
        qualityCase: { status: { in: activeStatuses } },
      },
      select: { id: true },
    });
    if (!cause) throw new QualityCaseNotFoundError();

    await assertEvidenceSelection(tx, qualityCaseId, evidenceIds);

    return tx.contributingCause.update({
      where: { id: cause.id },
      data: {
        content: normalized,
        evidenceLinks: {
          deleteMany: {},
          create: evidenceIds.map((evidenceId) => ({ evidenceId })),
        },
      },
      include: { evidenceLinks: true },
    });
  });
}

export async function removeContributingCause(qualityCaseId: string, causeId: string) {
  return getPrisma().$transaction(async (tx) => {
    await lockActiveQualityCase(tx, qualityCaseId);
    const result = await tx.contributingCause.deleteMany({
      where: { id: causeId, qualityCaseId },
    });
    if (result.count !== 1) throw new QualityCaseNotFoundError();
  });
}

export async function updateWorkingRootCause(
  qualityCaseId: string,
  content: string,
) {
  const normalized = validateWorkingRootCauseContent(content);

  return getPrisma().$transaction(async (tx) => {
    await lockActiveQualityCase(tx, qualityCaseId);
    return tx.qualityCase.update({
      where: { id: qualityCaseId },
      data: { workingRootCause: normalized },
    });
  });
}

export async function addCorrectiveAction(qualityCaseId: string, content: string) {
  const normalized = validateCorrectiveActionContent(content);

  return getPrisma().$transaction(async (tx) => {
    await lockActiveQualityCase(tx, qualityCaseId);
    return tx.correctiveAction.create({
      data: { qualityCaseId, content: normalized },
    });
  });
}

export async function updateCorrectiveAction(
  qualityCaseId: string,
  actionId: string,
  content: string,
) {
  const normalized = validateCorrectiveActionContent(content);

  return getPrisma().$transaction(async (tx) => {
    await lockActiveQualityCase(tx, qualityCaseId);
    const result = await tx.correctiveAction.updateMany({
      where: { id: actionId, qualityCaseId },
      data: { content: normalized },
    });
    if (result.count !== 1) throw new QualityCaseNotFoundError();
  });
}

export async function removeCorrectiveAction(
  qualityCaseId: string,
  actionId: string,
) {
  return getPrisma().$transaction(async (tx) => {
    await lockActiveQualityCase(tx, qualityCaseId);
    const result = await tx.correctiveAction.deleteMany({
      where: { id: actionId, qualityCaseId },
    });
    if (result.count !== 1) throw new QualityCaseNotFoundError();
  });
}

export async function resolveQualityCase(qualityCaseId: string) {
  return getPrisma().$transaction(async (tx) => {
    const qualityCase = await lockQualityCase(tx, qualityCaseId);

    if (qualityCase.status === QualityCaseStatus.RESOLVED) {
      throw new QualityCaseResolutionError(
        "Kasus Kualitas ini sudah selesai dan bersifat baca-saja.",
      );
    }

    if (qualityCase.status !== QualityCaseStatus.INVESTIGATING) {
      throw new QualityCaseResolutionError(
        "Kasus Kualitas perlu berada dalam investigasi sebelum diselesaikan.",
      );
    }

    const [evidenceCount, contributingCauseCount, correctiveActionCount] =
      await Promise.all([
        tx.evidence.count({ where: { qualityCaseId } }),
        tx.contributingCause.count({ where: { qualityCaseId } }),
        tx.correctiveAction.count({ where: { qualityCaseId } }),
      ]);
    const readiness = getResolutionReadiness({
      problem: qualityCase.problem,
      evidenceCount,
      contributingCauseEvidenceCounts: Array.from(
        { length: contributingCauseCount },
        () => 0,
      ),
      workingRootCause: qualityCase.workingRootCause,
      correctiveActionCount,
    });

    if (!readiness.complete) {
      const missing = readiness.requirements
        .filter((requirement) => !requirement.complete)
        .map((requirement) => requirement.label)
        .join(", ");
      throw new QualityCaseResolutionError(
        `Kasus Kualitas belum dapat diselesaikan. Lengkapi: ${missing}.`,
      );
    }

    const resolved = await tx.qualityCase.updateMany({
      where: { id: qualityCaseId, status: QualityCaseStatus.INVESTIGATING },
      data: { status: QualityCaseStatus.RESOLVED },
    });
    if (resolved.count !== 1) {
      throw new QualityCaseResolutionError(
        "Kasus Kualitas belum dapat diselesaikan. Coba lagi.",
      );
    }

    return { id: qualityCaseId, status: QualityCaseStatus.RESOLVED };
  });
}
