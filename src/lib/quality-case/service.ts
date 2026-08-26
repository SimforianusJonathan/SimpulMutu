import { QualityCaseStatus } from "@/generated/prisma/client";

import { getPrisma } from "@/lib/db/prisma";
import { type QualityCaseInput, validateQualityCaseInput } from "./input";

const activeStatuses = [QualityCaseStatus.DRAFT, QualityCaseStatus.INVESTIGATING];

export function initialQualityCaseStatus() {
  return QualityCaseStatus.DRAFT;
}

export class QualityCaseNotFoundError extends Error {
  constructor() {
    super("Kasus Kualitas tidak ditemukan atau tidak lagi aktif.");
    this.name = "QualityCaseNotFoundError";
  }
}

export function validateEvidenceContent(content: string) {
  const normalized = content.trim();
  if (!normalized) throw new Error("Bukti perlu diisi sebelum disimpan.");
  return normalized;
}

export async function createQualityCase(input: QualityCaseInput) {
  const validation = validateQualityCaseInput(input);
  if (!validation.ok) throw new Error(validation.error);
  return getPrisma().qualityCase.create({ data: { ...validation.value, status: initialQualityCaseStatus() } });
}

export async function updateActiveQualityCase(id: string, input: QualityCaseInput) {
  const validation = validateQualityCaseInput(input);
  if (!validation.ok) throw new Error(validation.error);
  const result = await getPrisma().qualityCase.updateMany({ where: { id, status: { in: activeStatuses } }, data: validation.value });
  if (result.count !== 1) throw new QualityCaseNotFoundError();
  return getActiveQualityCase(id);
}

export async function getActiveQualityCase(id: string) {
  return getPrisma().qualityCase.findFirst({ where: { id, status: { in: activeStatuses } }, include: { evidence: { orderBy: { createdAt: "asc" } } } });
}

export async function listActiveQualityCases() {
  return getPrisma().qualityCase.findMany({ where: { status: { in: activeStatuses } }, orderBy: { updatedAt: "desc" } });
}

export async function addEvidence(id: string, content: string) {
  const normalized = validateEvidenceContent(content);
  return getPrisma().$transaction(async (tx) => {
    const updated = await tx.qualityCase.updateMany({ where: { id, status: { in: activeStatuses } }, data: { status: QualityCaseStatus.INVESTIGATING } });
    if (updated.count !== 1) throw new QualityCaseNotFoundError();
    return tx.evidence.create({ data: { qualityCaseId: id, content: normalized } });
  });
}

export async function updateEvidence(id: string, evidenceId: string, content: string) {
  const normalized = validateEvidenceContent(content);
  const result = await getPrisma().evidence.updateMany({ where: { id: evidenceId, qualityCaseId: id, qualityCase: { status: { in: activeStatuses } } }, data: { content: normalized } });
  if (result.count !== 1) throw new QualityCaseNotFoundError();
}

export async function removeEvidence(id: string, evidenceId: string) {
  const result = await getPrisma().evidence.deleteMany({ where: { id: evidenceId, qualityCaseId: id, qualityCase: { status: { in: activeStatuses } } } });
  if (result.count !== 1) throw new QualityCaseNotFoundError();
}