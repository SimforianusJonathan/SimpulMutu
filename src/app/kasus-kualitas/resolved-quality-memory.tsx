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
    qualityCase.evidence.map((item, index) => [item.id, `E${index + 1}`]),
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
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <Link
        className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:text-emerald-300"
        href="/kasus-kualitas/selesai"
      >
        Kembali ke Kasus Kualitas selesai
      </Link>
      <p className="mt-8 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        SELESAI / MEMORI KUALITAS
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {qualityCase.problem}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
        Investigasi ini telah diselesaikan dan tersimpan sebagai Memori Kualitas
        baca-saja.
      </p>

      <div className="mt-10 space-y-8">
        <MemorySection title="Konteks">
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
        </MemorySection>

        <MemorySection title="Bukti">
          <ol className="space-y-3">
            {qualityCase.evidence.map((item, index) => (
              <li className="leading-7" key={item.id}>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  E{index + 1}
                </span>{" "}
                {item.content}
              </li>
            ))}
          </ol>
        </MemorySection>

        <MemorySection title="Faktor Penyebab dan hubungan Bukti">
          <ol className="space-y-4">
            {qualityCase.contributingCauses.map((cause, index) => (
              <li key={cause.id}>
                <p className="leading-7">
                  <span className="font-semibold text-amber-800 dark:text-amber-300">
                    C{index + 1}
                  </span>{" "}
                  {cause.content}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Didukung oleh:{" "}
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
          <div className="rounded-2xl bg-amber-50 p-5 dark:bg-amber-950/40">
            <p className="leading-7">{qualityCase.workingRootCause}</p>
            <p className="mt-3 text-sm font-semibold text-amber-950 dark:text-amber-100">
              Kesimpulan investigasi yang dicatat, bukan fakta terbukti.
            </p>
          </div>
        </MemorySection>

        <MemorySection title="Tindakan Korektif">
          <ol className="space-y-3">
            {qualityCase.correctiveActions.map((action, index) => (
              <li className="leading-7" key={action.id}>
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
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="border-t border-slate-200 pt-6 dark:border-slate-800">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
