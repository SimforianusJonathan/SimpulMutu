"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/access/current-session";
import {
  addContributingCause,
  InvalidEvidenceSelectionError,
  QualityCaseNotFoundError,
  removeContributingCause,
  updateContributingCause,
  validateContributingCauseContent,
} from "@/lib/quality-case/service";

export type CauseActionState = { error?: string; success?: string };

const persistenceError =
  "Faktor Penyebab belum tersimpan. Periksa koneksi lalu coba lagi.";

function readInput(formData: FormData) {
  const content = formData.get("content");
  if (typeof content !== "string") return null;

  try {
    return {
      content: validateContributingCauseContent(content),
      evidenceIds: formData
        .getAll("evidenceIds")
        .filter((value): value is string => typeof value === "string"),
    };
  } catch {
    return null;
  }
}

function failure(error: unknown): CauseActionState {
  if (
    error instanceof QualityCaseNotFoundError ||
    error instanceof InvalidEvidenceSelectionError
  ) {
    return { error: error.message };
  }
  return { error: persistenceError };
}

export async function addContributingCauseAction(
  qualityCaseId: string,
  _state: CauseActionState,
  formData: FormData,
): Promise<CauseActionState> {
  void _state;
  await requireSession();

  const input = readInput(formData);
  if (!input) return { error: "Faktor Penyebab perlu diisi sebelum disimpan." };

  try {
    await addContributingCause(
      qualityCaseId,
      input.content,
      input.evidenceIds,
    );
    revalidatePath(`/kasus-kualitas/${qualityCaseId}`);
    return { success: "Faktor Penyebab telah disimpan." };
  } catch (error) {
    return failure(error);
  }
}

export async function updateContributingCauseAction(
  qualityCaseId: string,
  causeId: string,
  _state: CauseActionState,
  formData: FormData,
): Promise<CauseActionState> {
  void _state;
  await requireSession();

  const input = readInput(formData);
  if (!input) return { error: "Faktor Penyebab perlu diisi sebelum disimpan." };

  try {
    await updateContributingCause(
      qualityCaseId,
      causeId,
      input.content,
      input.evidenceIds,
    );
    revalidatePath(`/kasus-kualitas/${qualityCaseId}`);
    return { success: "Faktor Penyebab dan hubungan Bukti telah diperbarui." };
  } catch (error) {
    return failure(error);
  }
}

export async function removeContributingCauseAction(
  qualityCaseId: string,
  causeId: string,
  _state: CauseActionState,
  _formData: FormData,
): Promise<CauseActionState> {
  void _state;
  void _formData;
  await requireSession();

  try {
    await removeContributingCause(qualityCaseId, causeId);
    revalidatePath(`/kasus-kualitas/${qualityCaseId}`);
    return { success: "Faktor Penyebab telah dihapus." };
  } catch (error) {
    return failure(error);
  }
}
