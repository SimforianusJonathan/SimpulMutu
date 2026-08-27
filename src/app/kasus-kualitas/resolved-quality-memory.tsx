import Link from "next/link";

type ResolvedQualityCase = {
  id: string;
  problem: string;
  productionStage: string | null;
  productModelReference: string | null;
  material: string | null;
  machineWorkstation: string | null;
  batchOrderReference: string | null;
  additionalContextNote: string | null;
  workingRootCause: string | null;
  evidence: { id: string; content: string }[];
  contributingCauses: {
    id: string;
    content: string;
    evidenceLinks: { evidenceId: string }[];
  }[];
  correctiveActions: { id: string; content: string }[];
};

export function ResolvedQualityMemory({
  qualityCase,
}: {
  qualityCase: ResolvedQualityCase;
}) {
  const evidenceLabels = new Map(
    qualityCase.evidence.map((item, index) => [
      item.id,
      "E" + (index + 1),
    ]),
  );
  const context = [
    ["Tahap Produksi / Proses", qualityCase.productionStage],
    ["Produk / Referensi Model", qualityCase.productModelReference],
    ["Material", qualityCase.material],
    ["Mesin / Workstation", qualityCase.machineWorkstation],
    ["Referensi Batch / Order", qualityCase.batchOrderReference],
    ["Catatan konteks tambahan", qualityCase.additionalContextNote],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:text-emerald-300"
        href="/kasus-kualitas/selesai"
      >
        Kembali ke Kasus Kualitas selesai
      </Link>

      <header className="mt-8 border-y border-slate-200 py-8 dark:border-slate-800">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          SELESAI / MEMORI KUALITAS
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {qualityCase.problem}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p>Investigasi telah selesai dan disimpan sebagai pembelajaran yang dapat ditinjau kembali.</p>
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            BACA-SAJA / TIDAK DAPAT DIUBAH
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <MemorySection title="Konteks">
          {context.length === 0 ? (
            <p className="leading-7 text-slate-600 dark:text-slate-300">
              Tidak ada konteks tambahan yang dicatat.
            </p>
          ) : (
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
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
        </MemorySection>

        <MemorySection title="Bukti">
          <ol className="space-y-4">
            {qualityCase.evidence.map((item, index) => (
              <li className="border-l border-emerald-800/30 pl-4 leading-7 dark:border-emerald-300/40" key={item.id}>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  E{index + 1}
                </span>{" "}
                {item.content}
              </li>
            ))}
          </ol>
        </MemorySection>

        <MemorySection className="lg:col-span-2" title="Faktor Penyebab dan hubungan Bukti">
          <ol className="grid gap-5 lg:grid-cols-2">
            {qualityCase.contributingCauses.map((cause, index) => (
              <li className="border-t border-slate-200 pt-4 dark:border-slate-800" key={cause.id}>
                <p className="leading-7">
                  <span className="font-semibold text-amber-800 dark:text-amber-300">
                    C{index + 1}
                  </span>{" "}
                  {cause.content}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    Didukung oleh:
                  </span>{" "}
                  {cause.evidenceLinks
                    .map((link) => evidenceLabels.get(link.evidenceId))
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </li>
            ))}
          </ol>
        </MemorySection>

        <MemorySection title="Dugaan Akar Penyebab">
          <div className="border-y border-amber-800/20 bg-amber-50/70 px-5 py-5 dark:border-amber-300/25 dark:bg-amber-950/30">
            <p className="leading-7">{qualityCase.workingRootCause}</p>
            <p className="mt-3 text-sm font-semibold text-amber-950 dark:text-amber-100">
              Kesimpulan investigasi yang dicatat, bukan fakta terbukti.
            </p>
          </div>
        </MemorySection>

        <MemorySection title="Tindakan Korektif">
          <ol className="space-y-4">
            {qualityCase.correctiveActions.map((action, index) => (
              <li className="border-l border-emerald-800/30 pl-4 leading-7 dark:border-emerald-300/40" key={action.id}>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Tindakan {index + 1}
                </span>{" "}
                {action.content}
              </li>
            ))}
          </ol>
        </MemorySection>
      </div>
    </section>
  );
}

function MemorySection({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <section className={"border-t border-slate-200 pt-5 dark:border-slate-800 " + className}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
