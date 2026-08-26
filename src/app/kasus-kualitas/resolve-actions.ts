"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/access/current-session";
import {
  QualityCaseNotFoundError,
  QualityCaseResolutionError,
  resolveQualityCase,
} from "@/lib/quality-case/service";

export type ResolveActionState = { error?: string };

const persistenceError =
  "Kasus Kualitas belum dapat diselesaikan. Periksa koneksi lalu coba lagi.";

export async function resolveQualityCaseAction(
  qualityCaseId: string,
  _previousState: ResolveActionState,
  _formData: FormData,
): Promise<ResolveActionState> {
  void _previousState;
  void _formData;
  await requireSession();

  try {
    await resolveQualityCase(qualityCaseId);
  } catch (error) {
    if (
      error instanceof QualityCaseResolutionError ||
      error instanceof QualityCaseNotFoundError
    ) {
      return { error: error.message };
    }
    return { error: persistenceError };
  }

  revalidatePath("/");
  revalidatePath("/kasus-kualitas/selesai");
  revalidatePath(`/kasus-kualitas/${qualityCaseId}`);
  redirect(`/kasus-kualitas/${qualityCaseId}`);
}