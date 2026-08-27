"use client";

import { useRef, useState } from "react";

import type { RelevantPastCase } from "@/lib/relevant-past-cases/rules";

export function RelevantPastCasesDrawer({
  referencesUnavailable,
  results,
}: {
  referencesUnavailable: boolean;
  results: RelevantPastCase[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const selectedCase = results.find((item) => item.id === selectedCaseId);

  function openDrawer() {
    dialogRef.current?.showModal();
  }

  function closeDrawer() {
    dialogRef.current?.close();
    setSelectedCaseId(null);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-emerald-700 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-400 dark:hover:text-emerald-200"
        onClick={openDrawer}
        ref={triggerRef}
        type="button"
      >
        Kasus Terdahulu yang Relevan
      </button>

      <dialog
        aria-labelledby="relevant-past-cases-title"
        className="m-0 ml-auto h-[100dvh] w-full max-w-xl border-0 bg-white p-0 text-slate-950 shadow-2xl backdrop:bg-slate-950/35 dark:bg-slate-950 dark:text-slate-50"
        onClose={() => {
          setSelectedCaseId(null);
          triggerRef.current?.focus();
        }}
        ref={dialogRef}
      >
        <section className="min-h-full px-5 py-8 sm:px-8">
          <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                REFERENSI HISTORIS
              </p>
              <h2
                className="mt-2 text-2xl font-semibold tracking-tight"
                id="relevant-past-cases-title"
              >
                Kasus Terdahulu yang Relevan
              </h2>
            </div>
            <button
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:hover:bg-slate-900"
              onClick={closeDrawer}
              type="button"
            >
              Tutup
            </button>
          </div>

          {referencesUnavailable ? (
            <DrawerMessage
              detail="Kasus terdahulu belum dapat dimuat. Investigasi saat ini tetap dapat dilanjutkan."
              title="Referensi historis tidak tersedia"
            />
          ) : selectedCase ? (
            <HistoricalPreview
              historicalCase={selectedCase}
              onBack={() => setSelectedCaseId(null)}
            />
          ) : results.length === 0 ? (
            <DrawerMessage
              detail="Tidak ada Memori Kualitas yang cukup relevan untuk ditampilkan. Anda tetap dapat melanjutkan investigasi saat ini."
              title="Belum ada Kasus Terdahulu yang Relevan"
            />
          ) : (
            <ul className="mt-8 space-y-4" aria-label="Daftar referensi historis">
              {results.map((result) => (
                <li className="border-b border-slate-200 pb-5 dark:border-slate-800" key={result.id}>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    SELESAI / MEMORI KUALITAS TERDAHULU
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-7">
                    {result.problem}
                  </h3>
                  <p className="mt-3 text-sm font-semibold">Relevan karena:</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {result.relevanceSignals.map((signal) => (
                      <li key={signal}>{signal}</li>
                    ))}
                  </ul>
                  <button
                    className="mt-4 text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:text-emerald-300"
                    onClick={() => setSelectedCaseId(result.id)}
                    type="button"
                  >
                    Lihat Memori Kualitas
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </dialog>
    </>
  );
}

function DrawerMessage({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="mt-10 max-w-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{detail}</p>
    </div>
  );
}

function HistoricalPreview({
  historicalCase,
  onBack,
}: {
  historicalCase: RelevantPastCase;
  onBack: () => void;
}) {
  const context = [
    ["Tahap Produksi / Proses", historicalCase.productionStage],
    ["Produk / Referensi Model", historicalCase.productModelReference],
    ["Material", historicalCase.material],
    ["Mesin / Workstation", historicalCase.machineWorkstation],
    ["Referensi Batch / Order", historicalCase.batchOrderReference],
    ["Catatan konteks tambahan", historicalCase.additionalContextNote],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  const evidenceLabels = new Map(
    historicalCase.evidence.map((evidence, index) => [
      evidence.id,
      "Bukti " + (index + 1),
    ]),
  );

  return (
    <article className="mt-8">
      <button
        className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:text-emerald-300"
        onClick={onBack}
        type="button"
      >
        Kembali ke referensi
      </button>
      <p className="mt-8 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        MEMORI KUALITAS TERDAHULU / BACA-SAJA
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">
        {historicalCase.problem}
      </h3>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        Informasi ini berasal dari investigasi terdahulu dan menjadi referensi,
        bukan jawaban otomatis untuk Kasus Kualitas saat ini.
      </p>

      <PreviewSection title="Relevan karena">
        <ul className="space-y-1 leading-7">
          {historicalCase.relevanceSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </PreviewSection>
      <PreviewSection title="Konteks pada kasus terdahulu">
        {context.length === 0 ? (
          <p className="leading-7 text-slate-600 dark:text-slate-300">
            Tidak ada konteks tambahan yang dicatat.
          </p>
        ) : (
          <dl className="space-y-3">
            {context.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {label}
                </dt>
                <dd className="mt-1 leading-6">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </PreviewSection>
      <PreviewSection title="Bukti pada kasus terdahulu">
        <ol className="space-y-2 leading-7">
          {historicalCase.evidence.map((evidence, index) => (
            <li key={evidence.id}>Bukti {index + 1}: {evidence.content}</li>
          ))}
        </ol>
      </PreviewSection>
      <PreviewSection title="Faktor Penyebab pada kasus terdahulu">
        <ol className="space-y-2 leading-7">
          {historicalCase.contributingCauses.map((cause, index) => (
            <li key={cause.id}>
              <p>Faktor {index + 1}: {cause.content}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Didukung oleh: {cause.evidenceLinks.length > 0
                  ? cause.evidenceLinks
                      .map((link) => evidenceLabels.get(link.evidenceId))
                      .filter(Boolean)
                      .join(", ")
                  : "Belum ada Bukti yang dihubungkan."}
              </p>
            </li>
          ))}
        </ol>
      </PreviewSection>
      <PreviewSection title="Dugaan Akar Penyebab pada kasus terdahulu">
        <p className="leading-7">{historicalCase.workingRootCause}</p>
      </PreviewSection>
      <PreviewSection title="Tindakan Korektif pada kasus terdahulu">
        <ol className="space-y-2 leading-7">
          {historicalCase.correctiveActions.map((action, index) => (
            <li key={action.id}>Tindakan {index + 1}: {action.content}</li>
          ))}
        </ol>
      </PreviewSection>
    </article>
  );
}

function PreviewSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-800">
      <h4 className="font-semibold">{title}</h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}
