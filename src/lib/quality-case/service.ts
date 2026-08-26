import { QualityCaseStatus } from "@/generated/prisma/client";

import { getPrisma } from "@/lib/db/prisma";
import { type QualityCaseInput, validateQualityCaseInput } from "./input";

export function initialQualityCaseStatus() {
  return QualityCaseStatus.DRAFT;
}

export class QualityCaseNotFoundError extends Error {
  constructor() {
    super("Kasus Kualitas tidak ditemukan atau tidak lagi aktif.");
    this.name = "QualityCaseNotFoundError";
  }
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
    where: { id, status: initialQualityCaseStatus() },
    data: validation.value,
  });

  if (result.count !== 1) throw new QualityCaseNotFoundError();
  return getActiveQualityCase(id);
}

export async function getActiveQualityCase(id: string) {
  return getPrisma().qualityCase.findFirst({
    where: { id, status: initialQualityCaseStatus() },
  });
}

export async function listActiveQualityCases() {
  return getPrisma().qualityCase.findMany({
    where: { status: initialQualityCaseStatus() },
    orderBy: { updatedAt: "desc" },
  });
}