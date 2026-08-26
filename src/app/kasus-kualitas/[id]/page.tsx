import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/app/components/app-shell";
import { requireSession } from "@/lib/access/current-session";
import { getActiveQualityCase } from "@/lib/quality-case/service";

import { updateQualityCaseAction } from "../actions";
import { QualityCaseForm } from "../case-form";

export default async function QualityCasePage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  const qualityCase = await getActiveQualityCase(id);

  if (!qualityCase) notFound();

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <Link className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:text-emerald-300" href="/">Kembali ke Kasus Kualitas aktif</Link>
        <p className="mt-10 text-sm font-semibold text-emerald-800 dark:text-emerald-300">DRAF · KASUS KUALITAS AKTIF</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Masalah &amp; Konteks</h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">Kasus ini belum selesai dan dapat diperbarui selama investigasi berlangsung.</p>
        <QualityCaseForm action={updateQualityCaseAction.bind(null, qualityCase.id)} submitLabel="Simpan perubahan" values={qualityCase} />
      </section>
    </AppShell>
  );
}