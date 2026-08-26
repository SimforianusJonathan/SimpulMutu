import Link from "next/link";

import { AppShell } from "@/app/components/app-shell";
import { requireSession } from "@/lib/access/current-session";
import { listResolvedQualityCases } from "@/lib/quality-case/service";

export default async function CompletedQualityCasesPage() {
  await requireSession();

  let qualityCases;
  try {
    qualityCases = await listResolvedQualityCases();
  } catch {
    return (
      <AppShell>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            KASUS KUALITAS {" \u00b7 "}SELESAI
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Memori Kualitas belum dapat dimuat
          </h1>
          <p
            className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-slate-300"
            role="alert"
          >
            Koneksi Memori Kualitas sedang tidak tersedia. Muat ulang halaman
            untuk mencoba lagi.
          </p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          KASUS KUALITAS · SELESAI
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Memori Kualitas
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
          Kasus Kualitas yang telah selesai tersimpan sebagai catatan investigasi
          baca-saja.
        </p>

        {qualityCases.length === 0 ? (
          <div className="mt-14 max-w-2xl border-t border-slate-300 pt-8 dark:border-slate-700">
            <h2 className="text-xl font-semibold">Belum ada Memori Kualitas.</h2>
            <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
              Selesaikan investigasi yang lengkap untuk menjadikannya Memori
              Kualitas.
            </p>
          </div>
        ) : (
          <ul className="mt-14 grid gap-4" aria-label="Memori Kualitas">
            {qualityCases.map((qualityCase) => (
              <li key={qualityCase.id}>
                <Link
                  className="block rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:border-slate-800 dark:bg-slate-900"
                  href={`/kasus-kualitas/${qualityCase.id}`}
                >
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    SELESAI / MEMORI KUALITAS
                  </p>
                  <h2 className="mt-3 text-xl font-semibold">{qualityCase.problem}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {qualityCase.productionStage ??
                      "Tahap Produksi / Proses tidak dicatat"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}