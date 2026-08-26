import Link from "next/link";

import { AppShell } from "@/app/components/app-shell";
import { requireSession } from "@/lib/access/current-session";

export default async function CompletedQualityCasesPage() {
  await requireSession();

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">KASUS KUALITAS · SELESAI</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Belum ada Memori Kualitas.</h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">Pada tahap ini belum ada Kasus Kualitas yang dapat diselesaikan. Kasus aktif tetap berada di ruang investigasi.</p>
        <Link className="mt-10 inline-flex rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 active:translate-y-px dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400" href="/">Lihat Kasus Kualitas aktif</Link>
      </section>
    </AppShell>
  );
}