import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/app/components/app-shell";
import { requireSession } from "@/lib/access/current-session";
import { getActiveQualityCase } from "@/lib/quality-case/service";
import {
  getResolutionReadiness,
  getStageCompleteness,
} from "@/lib/quality-case/stages";
import { updateQualityCaseAction } from "../actions";
import { CorrectiveActionPanel } from "../corrective-action-panel";
import { QualityCaseForm } from "../case-form";
import { EvidenceLoom } from "../evidence-loom";
import { EvidencePanel } from "../evidence-panel";
import { RootCausePanel } from "../root-cause-panel";

const stages = [
  "Masalah & Konteks",
  "Bukti",
  "Faktor Penyebab",
  "Dugaan Akar Penyebab",
  "Tindakan Korektif",
  "Ringkasan",
] as const;

type Stage =
  | "masalah"
  | "bukti"
  | "faktor"
  | "akar"
  | "tindakan"
  | "ringkasan";

const stageKeys: Stage[] = [
  "masalah",
  "bukti",
  "faktor",
  "akar",
  "tindakan",
  "ringkasan",
];

export default async function QualityCasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tahap?: string }>;
}) {
  await requireSession();

  const { id } = await params;
  const { tahap } = await searchParams;
  const qualityCase = await getActiveQualityCase(id);
  if (!qualityCase) notFound();

  const stage = stageKeys.includes(tahap as Stage)
    ? (tahap as Stage)
    : "masalah";
  const contributingCauseEvidenceCounts = qualityCase.contributingCauses.map(
    (cause) => cause.evidenceLinks.length,
  );
  const completeness = getStageCompleteness(
    qualityCase.problem,
    qualityCase.evidence.length,
    contributingCauseEvidenceCounts,
    qualityCase.workingRootCause,
    qualityCase.correctiveActions.length,
  );
  const readiness = getResolutionReadiness({
    problem: qualityCase.problem,
    evidenceCount: qualityCase.evidence.length,
    contributingCauseEvidenceCounts,
    workingRootCause: qualityCase.workingRootCause,
    correctiveActionCount: qualityCase.correctiveActions.length,
  });
  const evidenceOrder = new Map(
    qualityCase.evidence.map((item, index) => [item.id, index]),
  );
  const causes = qualityCase.contributingCauses.map((cause) => ({
    id: cause.id,
    content: cause.content,
    evidenceIds: cause.evidenceLinks
      .map((link) => link.evidenceId)
      .sort(
        (left, right) =>
          (evidenceOrder.get(left) ?? 0) - (evidenceOrder.get(right) ?? 0),
      ),
  }));

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <Link
          className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:text-emerald-300"
          href="/"
        >
          Kembali ke Kasus Kualitas aktif
        </Link>

        <p className="mt-8 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          {qualityCase.status === "DRAFT" ? "DRAF" : "SEDANG DIINVESTIGASI"}{" \u00b7 "}
          KASUS KUALITAS AKTIF
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {qualityCase.problem}
        </h1>

        <nav
          aria-label="Tahap investigasi"
          className="mt-10 overflow-x-auto border-y border-slate-200 py-4 dark:border-slate-800"
        >
          <ol className="flex min-w-max items-center gap-3 text-sm font-semibold">
            {stages.map((label, index) => {
              const key = stageKeys[index];
              const complete =
                (key === "masalah" && completeness.masalah) ||
                (key === "bukti" && completeness.bukti) ||
                (key === "faktor" && completeness.faktor) ||
                (key === "akar" && completeness.akar) ||
                (key === "tindakan" && completeness.tindakan);

              return (
                <li className="flex items-center gap-3" key={label}>
                  <Link
                    aria-current={key === stage ? "step" : undefined}
                    className={
                      key === stage
                        ? "rounded-lg bg-emerald-800 px-3 py-2 text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/25 dark:bg-emerald-500 dark:text-emerald-950"
                        : "rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 dark:text-slate-200 dark:hover:bg-slate-800"
                    }
                    href={`/kasus-kualitas/${id}?tahap=${key}`}
                  >
                    {label}
                    {complete ? " lengkap" : ""}
                  </Link>
                  {index < stages.length - 1 ? (
                    <span aria-hidden="true" className="text-slate-400">
                      -&gt;
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-10">
          {stage === "masalah" ? (
            <>
              <h2 className="text-2xl font-semibold">Masalah &amp; Konteks</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Masalah dan konteks dapat terus diperbarui selama Kasus
                Kualitas aktif.
              </p>
              <QualityCaseForm
                action={updateQualityCaseAction.bind(null, qualityCase.id)}
                submitLabel="Simpan perubahan"
                values={qualityCase}
              />
            </>
          ) : null}

          {stage === "bukti" ? (
            <EvidencePanel caseId={id} evidence={qualityCase.evidence} />
          ) : null}

          {stage === "faktor" ? (
            <EvidenceLoom
              caseId={id}
              causes={causes}
              evidence={qualityCase.evidence}
            />
          ) : null}

          {stage === "akar" ? (
            <RootCausePanel
              caseId={id}
              contributingCauseCount={causes.length}
              evidenceCount={qualityCase.evidence.length}
              workingRootCause={qualityCase.workingRootCause}
            />
          ) : null}

          {stage === "tindakan" ? (
            <CorrectiveActionPanel
              actions={qualityCase.correctiveActions}
              caseId={id}
            />
          ) : null}

          {stage === "ringkasan" ? (
            <Summary
              caseContext={qualityCase}
              causes={causes}
              evidence={qualityCase.evidence}
              readiness={readiness}
            />
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}

function Summary({
  caseContext,
  causes,
  evidence,
  readiness,
}: {
  caseContext: {
    problem: string;
    productionStage: string | null;
    productModelReference: string | null;
    material: string | null;
    machineWorkstation: string | null;
    batchOrderReference: string | null;
    additionalContextNote: string | null;
    workingRootCause: string | null;
    correctiveActions: { id: string; content: string }[];
  };
  causes: { id: string; content: string; evidenceIds: string[] }[];
  evidence: { id: string; content: string }[];
  readiness: ReturnType<typeof getResolutionReadiness>;
}) {
  const evidenceLabels = new Map(
    evidence.map((item, index) => [item.id, `E${index + 1}`]),
  );
  const context = [
    ["Tahap Produksi / Proses", caseContext.productionStage],
    ["Produk / Referensi Model", caseContext.productModelReference],
    ["Material", caseContext.material],
    ["Mesin / Workstation", caseContext.machineWorkstation],
    ["Referensi Batch / Order", caseContext.batchOrderReference],
    ["Catatan konteks tambahan", caseContext.additionalContextNote],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <section className="max-w-4xl">
      <h2 className="text-2xl font-semibold tracking-tight">Ringkasan</h2>
      <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
        Ringkasan ini menyajikan penalaran investigasi yang tersedia saat ini.
        Kasus Kualitas tetap aktif dan belum diselesaikan dari halaman ini.
      </p>

      <div className="mt-8 space-y-8">
        <SummarySection title="Masalah">
          <p className="leading-7">{caseContext.problem}</p>
        </SummarySection>

        <SummarySection title="Konteks">
          {context.length === 0 ? (
            <p className="leading-7 text-slate-600 dark:text-slate-300">
              Belum ada konteks tambahan yang dicatat.
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
        </SummarySection>

        <SummarySection title="Bukti">
          {evidence.length === 0 ? (
            <p className="leading-7 text-slate-600 dark:text-slate-300">
              Belum ada Bukti yang dicatat.
            </p>
          ) : (
            <ol className="space-y-3">
              {evidence.map((item, index) => (
                <li key={item.id}>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    E{index + 1}
                  </span>{" "}
                  <span className="leading-7">{item.content}</span>
                </li>
              ))}
            </ol>
          )}
        </SummarySection>

        <SummarySection title="Faktor Penyebab dan hubungan Bukti">
          {causes.length === 0 ? (
            <p className="leading-7 text-slate-600 dark:text-slate-300">
              Belum ada Faktor Penyebab yang dicatat.
            </p>
          ) : (
            <ol className="space-y-4">
              {causes.map((cause, index) => (
                <li key={cause.id}>
                  <p className="leading-7">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">
                      C{index + 1}
                    </span>{" "}
                    {cause.content}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Didukung oleh:{" "}
                    {cause.evidenceIds.length > 0
                      ? cause.evidenceIds
                          .map((id) => evidenceLabels.get(id))
                          .filter(Boolean)
                          .join(", ")
                      : "Belum ada Bukti yang dihubungkan."}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </SummarySection>

        <SummarySection title="Dugaan Akar Penyebab">
          <div className="rounded-2xl bg-amber-50 p-5 dark:bg-amber-950/40">
            {caseContext.workingRootCause ? (
              <p className="leading-7">{caseContext.workingRootCause}</p>
            ) : (
              <p className="leading-7 text-slate-700 dark:text-slate-200">
                Belum ada Dugaan Akar Penyebab yang dicatat.
              </p>
            )}
            <p className="mt-3 text-sm font-semibold text-amber-950 dark:text-amber-100">
              Kesimpulan sementara, bukan fakta terbukti.
            </p>
          </div>
        </SummarySection>

        <SummarySection title="Tindakan Korektif">
          {caseContext.correctiveActions.length === 0 ? (
            <p className="leading-7 text-slate-600 dark:text-slate-300">
              Belum ada Tindakan Korektif yang dicatat.
            </p>
          ) : (
            <ol className="space-y-3">
              {caseContext.correctiveActions.map((action, index) => (
                <li className="leading-7" key={action.id}>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Tindakan {index + 1}
                  </span>{" "}
                  {action.content}
                </li>
              ))}
            </ol>
          )}
        </SummarySection>

        <SummarySection title="Pemeriksaan kesiapan penyelesaian">
          <ul className="space-y-2">
            {readiness.requirements.map((requirement) => (
              <li className="flex items-baseline justify-between gap-4" key={requirement.key}>
                <span>{requirement.label}</span>
                <span
                  className={
                    requirement.complete
                      ? "text-sm font-semibold text-emerald-800 dark:text-emerald-300"
                      : "text-sm font-semibold text-slate-600 dark:text-slate-300"
                  }
                >
                  {requirement.complete ? "Lengkap" : "Belum lengkap"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {readiness.complete
              ? "Seluruh informasi yang diperlukan untuk penyelesaian sudah tercatat. Kasus Kualitas tetap aktif."
              : "Lengkapi informasi yang masih belum tersedia. Kasus Kualitas tetap aktif."}
          </p>
        </SummarySection>
      </div>
    </section>
  );
}

function SummarySection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="border-t border-slate-200 pt-6 dark:border-slate-800">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}
