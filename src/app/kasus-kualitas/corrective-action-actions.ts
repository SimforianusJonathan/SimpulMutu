"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/access/current-session";
import {
  addCorrectiveAction,
  QualityCaseNotFoundError,
  removeCorrectiveAction,
  updateCorrectiveAction,
  validateCorrectiveActionContent,
} from "@/lib/quality-case/service";

export type CorrectiveActionState = { error?: string; success?: string };

function readContent(formData: FormData) {
  const content = formData.get("content");
  if (typeof content !== "string") return null;

  try {
    return validateCorrectiveActionContent(content);
  } catch {
    return null;
  }
}

function failure(error: unknown): CorrectiveActionState {
  if (error instanceof QualityCaseNotFoundError) return { error: error.message };
  return {
    error: "Tindakan Korektif belum tersimpan. Periksa koneksi lalu coba lagi.",
  };
}

export async function addCorrectiveActionAction(
  qualityCaseId: string,
  _state: CorrectiveActionState,
  formData: FormData,
): Promise<CorrectiveActionState> {
  void _state;
  await requireSession();

  const content = readContent(formData);
  if (!content) return { error: "Tindakan Korektif perlu diisi sebelum disimpan." };

  try {
    await addCorrectiveAction(qualityCaseId, content);
    revalidatePath(`/kasus-kualitas/${qualityCaseId}`);
    return { success: "Tindakan Korektif telah disimpan." };
  } catch (error) {
    return failure(error);
  }
}

export async function updateCorrectiveActionAction(
  qualityCaseId: string,
  actionId: string,
  _state: CorrectiveActionState,
  formData: FormData,
): Promise<CorrectiveActionState> {
  void _state;
  await requireSession();

  const content = readContent(formData);
  if (!content) return { error: "Tindakan Korektif perlu diisi sebelum disimpan." };

  try {
    await updateCorrectiveAction(qualityCaseId, actionId, content);
    revalidatePath(`/kasus-kualitas/${qualityCaseId}`);
    return { success: "Tindakan Korektif telah diperbarui." };
  } catch (error) {
    return failure(error);
  }
}

export async function removeCorrectiveActionAction(
  qualityCaseId: string,
  actionId: string,
  _state: CorrectiveActionState,
  _formData: FormData,
): Promise<CorrectiveActionState> {
  void _state;
  void _formData;
  await requireSession();

  try {
    await removeCorrectiveAction(qualityCaseId, actionId);
    revalidatePath(`/kasus-kualitas/${qualityCaseId}`);
    return { success: "Tindakan Korektif telah dihapus." };
  } catch (error) {
    return failure(error);
  }
}
