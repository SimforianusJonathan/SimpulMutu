"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/access/current-session";
import { qualityCaseInputFromFormData, validateQualityCaseInput } from "@/lib/quality-case/input";
import { createQualityCase, QualityCaseNotFoundError, updateActiveQualityCase } from "@/lib/quality-case/service";

export type QualityCaseActionState = { error?: string; success?: string };

const persistenceError = "Kasus Kualitas belum tersimpan. Periksa koneksi lalu coba lagi.";

function validateFormData(formData: FormData): QualityCaseActionState | null {
  const validation = validateQualityCaseInput(qualityCaseInputFromFormData(formData));
  return validation.ok ? null : { error: validation.error };
}

export async function createQualityCaseAction(
  _previousState: QualityCaseActionState,
  formData: FormData,
): Promise<QualityCaseActionState> {
  await requireSession();
  const validationError = validateFormData(formData);
  if (validationError) return validationError;

  let qualityCaseId: string;
  try {
    const qualityCase = await createQualityCase(qualityCaseInputFromFormData(formData));
    qualityCaseId = qualityCase.id;
  } catch {
    return { error: persistenceError };
  }

  revalidatePath("/");
  redirect(`/kasus-kualitas/${qualityCaseId}`);
}

export async function updateQualityCaseAction(
  id: string,
  _previousState: QualityCaseActionState,
  formData: FormData,
): Promise<QualityCaseActionState> {
  await requireSession();
  const validationError = validateFormData(formData);
  if (validationError) return validationError;

  try {
    await updateActiveQualityCase(id, qualityCaseInputFromFormData(formData));
    revalidatePath("/");
    revalidatePath(`/kasus-kualitas/${id}`);
    return { success: "Perubahan pada Kasus Kualitas telah disimpan." };
  } catch (error) {
    if (error instanceof QualityCaseNotFoundError) return { error: error.message };
    return { error: persistenceError };
  }
}