"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/access/current-session";
import {
  QualityCaseNotFoundError,
  updateWorkingRootCause,
  validateWorkingRootCauseContent,
} from "@/lib/quality-case/service";

export type RootCauseActionState = { error?: string; success?: string };

export async function updateWorkingRootCauseAction(
  qualityCaseId: string,
  _state: RootCauseActionState,
  formData: FormData,
): Promise<RootCauseActionState> {
  void _state;
  await requireSession();

  const content = formData.get("content");
  if (typeof content !== "string") {
    return { error: "Dugaan Akar Penyebab perlu diisi sebelum disimpan." };
  }

  let normalized: string;
  try {
    normalized = validateWorkingRootCauseContent(content);
  } catch {
    return { error: "Dugaan Akar Penyebab perlu diisi sebelum disimpan." };
  }

  try {
    await updateWorkingRootCause(qualityCaseId, normalized);
    revalidatePath(`/kasus-kualitas/${qualityCaseId}`);
    return { success: "Dugaan Akar Penyebab telah disimpan sebagai kesimpulan sementara." };
  } catch (error) {
    if (error instanceof QualityCaseNotFoundError) return { error: error.message };
    return {
      error: "Dugaan Akar Penyebab belum tersimpan. Periksa koneksi lalu coba lagi.",
    };
  }
}
