import Link from "next/link";

import { AppShell } from "@/app/components/app-shell";
import { requireSession } from "@/lib/access/current-session";
import { listActiveQualityCases } from "@/lib/quality-case/service";

export default async function HomePage() {
  await requireSession();

  let qualityCases;
  try {
    qualityCases = await listActiveQualityCases();
  } catch {
    return (
      <AppShell>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Kasus Kualitas</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Kasus aktif belum dapat dimuat</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300" role="alert">
            Koneksi Kasus Kualitas sedang tidak tersedia. Muat ulang halaman untuk mencoba lagi.
          </p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Kasus Kualitas · Aktif</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Mulai dari masalah yang sedang dihadapi.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Setiap Kasus Kualitas adalah ruang kerja untuk mengumpulkan konteks dan melanjutkan investigasi.
            </p>
          </div>
          <Link className="rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 active:translate-y-px dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400" href="/kasus-kualitas/baru">
            Buat Kasus Kualitas
          </Link>
        </div>

        {qualityCases.length === 0 ? (
          <div className="mt-14 max-w-2xl border-t border-slate-300 pt-8 dark:border-slate-700">
            <h2 className="text-xl font-semibold">Belum ada Kasus Kualitas aktif</h2>
            <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">Buat Kasus Kualitas pertama untuk memulai investigasi dari masalah yang sedang terjadi.</p>
          </div>
        ) : (
          <ul className="mt-14 grid gap-4" aria-label="Kasus Kualitas aktif">
            {qualityCases.map((qualityCase) => (
              <li key={qualityCase.id}>
                <Link className="block rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:border-slate-800 dark:bg-slate-900" href={`/kasus-kualitas/${qualityCase.id}`}>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">DRAF · KASUS AKTIF</p>
                  <h2 className="mt-3 text-xl font-semibold">{qualityCase.problem}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{qualityCase.productionStage ?? "Tahap Produksi / Proses belum diketahui"}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}