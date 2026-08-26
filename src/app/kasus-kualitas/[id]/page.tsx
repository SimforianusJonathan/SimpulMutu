import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/app/components/app-shell";
import { requireSession } from "@/lib/access/current-session";
import { getActiveQualityCase } from "@/lib/quality-case/service";
import { getStageCompleteness } from "@/lib/quality-case/stages";
import { updateQualityCaseAction } from "../actions";
import { QualityCaseForm } from "../case-form";
import { EvidencePanel } from "../evidence-panel";

const stages = ["Masalah & Konteks", "Bukti", "Faktor Penyebab", "Dugaan Akar Penyebab", "Tindakan Korektif", "Ringkasan"] as const;
type Stage = "masalah" | "bukti" | "faktor" | "akar" | "tindakan" | "ringkasan";
const stageKeys: Stage[] = ["masalah", "bukti", "faktor", "akar", "tindakan", "ringkasan"];

export default async function QualityCasePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tahap?: string }> }) {
  await requireSession();
  const { id } = await params; const { tahap } = await searchParams;
  const qualityCase = await getActiveQualityCase(id); if (!qualityCase) notFound();
  const stage = stageKeys.includes(tahap as Stage) ? tahap as Stage : "masalah";
  const completeness = getStageCompleteness(qualityCase.problem, qualityCase.evidence.length);
  return <AppShell><section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16"><Link className="text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-300" href="/">Kembali ke Kasus Kualitas aktif</Link><p className="mt-8 text-sm font-semibold text-emerald-800 dark:text-emerald-300">{qualityCase.status === "DRAFT" ? "DRAF" : "SEDANG DIINVESTIGASI"} · KASUS KUALITAS AKTIF</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{qualityCase.problem}</h1><nav aria-label="Tahap investigasi" className="mt-10 overflow-x-auto border-y border-slate-200 py-4 dark:border-slate-800"><ol className="flex min-w-max items-center gap-3 text-sm font-semibold">{stages.map((label, index) => <li className="flex items-center gap-3" key={label}><Link aria-current={stageKeys[index] === stage ? "step" : undefined} className={stageKeys[index] === stage ? "rounded-lg bg-emerald-800 px-3 py-2 text-white dark:bg-emerald-500 dark:text-slate-950" : "rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800"} href={`/kasus-kualitas/${id}?tahap=${stageKeys[index]}`}>{label}{(stageKeys[index] === "masalah" && completeness.masalah) || (stageKeys[index] === "bukti" && completeness.bukti) ? " ✓" : ""}</Link>{index < stages.length - 1 ? <span aria-hidden="true" className="text-slate-400">→</span> : null}</li>)}</ol></nav><div className="mt-10">{stage === "masalah" ? <><h2 className="text-2xl font-semibold">Masalah &amp; Konteks</h2><p className="mt-2 text-slate-600 dark:text-slate-300">Masalah dan konteks dapat terus diperbarui selama Kasus Kualitas aktif.</p><QualityCaseForm action={updateQualityCaseAction.bind(null, qualityCase.id)} submitLabel="Simpan perubahan" values={qualityCase} /></> : null}{stage === "bukti" ? <EvidencePanel caseId={id} evidence={qualityCase.evidence} /> : null}{stage === "ringkasan" ? <Summary problem={qualityCase.problem} evidenceCount={qualityCase.evidence.length} /> : null}{["faktor", "akar", "tindakan"].includes(stage) ? <LaterStage label={stages[stageKeys.indexOf(stage)]} /> : null}</div></section></AppShell>;
}
function LaterStage({ label }: { label: string }) { return <section><h2 className="text-2xl font-semibold">{label}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">Tahap ini adalah bagian dari alur investigasi, tetapi belum tersedia pada milestone ini. Tidak ada kesimpulan atau tindakan yang dibuat oleh sistem.</p></section>; }
function Summary({ problem, evidenceCount }: { problem: string; evidenceCount: number }) { return <section><h2 className="text-2xl font-semibold">Ringkasan yang tersedia</h2><dl className="mt-5 space-y-4 border-t border-slate-200 pt-5 dark:border-slate-800"><div><dt className="text-sm font-semibold text-slate-600 dark:text-slate-300">Masalah</dt><dd className="mt-1">{problem}</dd></div><div><dt className="text-sm font-semibold text-slate-600 dark:text-slate-300">Bukti</dt><dd className="mt-1">{evidenceCount === 0 ? "Belum ada Bukti yang dicatat." : `${evidenceCount} Bukti telah dicatat.`}</dd></div></dl><p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-300">Ringkasan ini belum menunjukkan kesiapan untuk menyelesaikan Kasus Kualitas.</p></section>; }