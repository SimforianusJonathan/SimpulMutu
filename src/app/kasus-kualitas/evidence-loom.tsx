"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  addContributingCauseAction,
  type CauseActionState,
  removeContributingCauseAction,
  updateContributingCauseAction,
} from "./cause-actions";

type EvidenceItem = {
  id: string;
  content: string;
};

type CauseItem = {
  id: string;
  content: string;
  evidenceIds: string[];
};

type FocusedItem =
  | { kind: "evidence"; id: string }
  | { kind: "cause"; id: string }
  | null;

type Connector = {
  causeId: string;
  evidenceId: string;
  path: string;
};

const initialState: CauseActionState = {};

export function EvidenceLoom({
  caseId,
  evidence,
  causes,
}: {
  caseId: string;
  evidence: EvidenceItem[];
  causes: CauseItem[];
}) {
  const [focused, setFocused] = useState<FocusedItem>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const loomRef = useRef<HTMLDivElement>(null);
  const evidenceRefs = useRef(new Map<string, HTMLButtonElement>());
  const causeRefs = useRef(new Map<string, HTMLButtonElement>());

  const measureConnectors = useCallback(() => {
    const loom = loomRef.current;
    if (!loom || window.innerWidth < 1024) {
      setConnectors([]);
      return;
    }

    const loomRect = loom.getBoundingClientRect();
    const next = causes.flatMap((cause) =>
      cause.evidenceIds.flatMap((evidenceId) => {
        const evidenceNode = evidenceRefs.current.get(evidenceId);
        const causeNode = causeRefs.current.get(cause.id);
        if (!evidenceNode || !causeNode) return [];

        const evidenceRect = evidenceNode.getBoundingClientRect();
        const causeRect = causeNode.getBoundingClientRect();
        const x1 = evidenceRect.right - loomRect.left;
        const y1 = evidenceRect.top + evidenceRect.height / 2 - loomRect.top;
        const x2 = causeRect.left - loomRect.left;
        const y2 = causeRect.top + causeRect.height / 2 - loomRect.top;
        const bend = Math.max(36, (x2 - x1) * 0.48);

        return [{
          causeId: cause.id,
          evidenceId,
          path: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
        }];
      }),
    );

    setConnectors(next);
  }, [causes]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(measureConnectors);
    const observer = new ResizeObserver(measureConnectors);
    if (loomRef.current) observer.observe(loomRef.current);
    window.addEventListener("resize", measureConnectors);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measureConnectors);
    };
  }, [measureConnectors]);

  const toggleFocus = (kind: "evidence" | "cause", id: string) => {
    setFocused((current) =>
      current?.kind === kind && current.id === id ? null : { kind, id },
    );
  };

  const isDirect = (connector: Connector) =>
    focused?.kind === "evidence"
      ? connector.evidenceId === focused.id
      : focused?.kind === "cause"
        ? connector.causeId === focused.id
        : false;

  const itemIsRelated = (kind: "evidence" | "cause", id: string) => {
    if (!focused) return true;
    if (focused.kind === kind && focused.id === id) return true;

    if (kind === "evidence" && focused.kind === "cause") {
      return causes
        .find((cause) => cause.id === focused.id)
        ?.evidenceIds.includes(id) ?? false;
    }

    if (kind === "cause" && focused.kind === "evidence") {
      return causes
        .find((cause) => cause.id === id)
        ?.evidenceIds.includes(focused.id) ?? false;
    }

    return false;
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Faktor Penyebab
        </h2>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Susun faktor yang mungkin berkontribusi, lalu tandai Bukti yang
          mendukung pertimbangan tersebut. Hubungan ini bukan pernyataan sebab
          yang telah terbukti.
        </p>
      </div>

      <NewCauseForm caseId={caseId} evidence={evidence} />

      <div
        className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] lg:gap-0"
        data-focus-kind={focused?.kind ?? "none"}
        data-testid="evidence-loom"
        ref={loomRef}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible lg:block"
          data-testid="evidence-loom-connectors"
        >
          {connectors.map((connector) => {
            const direct = isDirect(connector);
            const subdued = Boolean(focused) && !direct;
            return (
              <path
                className="fill-none stroke-emerald-700 transition-[opacity,stroke-width] duration-200 dark:stroke-emerald-300"
                d={connector.path}
                data-direct={direct ? "true" : "false"}
                data-loom-link={`${connector.evidenceId}:${connector.causeId}`}
                key={`${connector.evidenceId}:${connector.causeId}`}
                opacity={subdued ? 0.1 : direct ? 0.9 : 0.28}
                strokeDasharray={direct ? undefined : "5 7"}
                strokeLinecap="round"
                strokeWidth={direct ? 3 : 1.5}
              />
            );
          })}
        </svg>

        <section aria-labelledby="evidence-heading" className="relative z-10">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-semibold" id="evidence-heading">
              Bukti
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {evidence.length} Bukti
            </span>
          </div>
          <div className="space-y-3">
            {evidence.length === 0 ? (
              <p className="border-t border-slate-200 py-5 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                Belum ada Bukti. Tambahkan Bukti pada tahap sebelumnya agar
                hubungan dapat disusun.
              </p>
            ) : (
              evidence.map((item, index) => {
                const selected =
                  focused?.kind === "evidence" && focused.id === item.id;
                const related = itemIsRelated("evidence", item.id);
                return (
                  <button
                    aria-label={`Periksa Bukti E${index + 1}: ${item.content}`}
                    aria-pressed={selected}
                    className={`w-full rounded-2xl border bg-white p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/25 dark:bg-slate-900 ${
                      selected
                        ? "border-emerald-800 ring-2 ring-emerald-800/20 dark:border-emerald-400"
                        : "border-slate-200 hover:border-emerald-700/50 dark:border-slate-800"
                    } ${related ? "opacity-100" : "opacity-45"}`}
                    key={item.id}
                    onClick={() => toggleFocus("evidence", item.id)}
                    ref={(node) => {
                      if (node) evidenceRefs.current.set(item.id, node);
                      else evidenceRefs.current.delete(item.id);
                    }}
                    type="button"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                        E{index + 1}
                      </span>
                      {selected ? (
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                          Dipilih
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2 block leading-6">{item.content}</span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <div aria-hidden="true" className="hidden lg:block" />

        <section aria-labelledby="causes-heading" className="relative z-10">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-semibold" id="causes-heading">
              Faktor Penyebab
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {causes.length} Faktor
            </span>
          </div>
          <div className="space-y-4">
            {causes.length === 0 ? (
              <p className="border-t border-slate-200 py-5 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                Belum ada Faktor Penyebab. Catat faktor yang sedang
                dipertimbangkan tanpa menyatakannya sebagai kesimpulan.
              </p>
            ) : (
              causes.map((cause, index) => (
                <CauseCard
                  caseId={caseId}
                  cause={cause}
                  evidence={evidence}
                  index={index + 1}
                  key={cause.id}
                  onInspect={() => toggleFocus("cause", cause.id)}
                  related={itemIsRelated("cause", cause.id)}
                  selected={
                    focused?.kind === "cause" && focused.id === cause.id
                  }
                  setRef={(node) => {
                    if (node) causeRefs.current.set(cause.id, node);
                    else causeRefs.current.delete(cause.id);
                  }}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {focused ? (
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Hubungan langsung untuk item yang dipilih ditegaskan dengan garis
          utuh dan lebih tebal. Pilih item yang sama lagi untuk kembali melihat
          seluruh hubungan secara setara.
        </p>
      ) : (
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Semua hubungan tampil sebagai garis putus-putus yang tenang pada
          layar lebar. Pilih Bukti atau Faktor Penyebab untuk memeriksa hubungan
          langsungnya.
        </p>
      )}
    </section>
  );
}

function NewCauseForm({
  caseId,
  evidence,
}: {
  caseId: string;
  evidence: EvidenceItem[];
}) {
  const [state, action, pending] = useActionState(
    addContributingCauseAction.bind(null, caseId),
    initialState,
  );

  return (
    <form
      action={action}
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <label className="block text-sm font-semibold" htmlFor="new-cause">
        Faktor Penyebab baru
      </label>
      <textarea
        className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
        id="new-cause"
        name="content"
        placeholder="Contoh: Pengaturan tegangan benang mungkin berkontribusi."
        required
      />
      <EvidenceChoices evidence={evidence} legend="Bukti pendukung awal" />
      <Feedback state={state} />
      <button
        className="mt-4 rounded-xl bg-emerald-800 px-4 py-2 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 disabled:cursor-wait disabled:opacity-70 dark:bg-emerald-500 dark:text-emerald-950"
        disabled={pending}
        type="submit"
      >
        {pending ? "Menyimpan..." : "Tambah Faktor Penyebab"}
      </button>
    </form>
  );
}

function CauseCard({
  caseId,
  cause,
  evidence,
  index,
  onInspect,
  related,
  selected,
  setRef,
}: {
  caseId: string;
  cause: CauseItem;
  evidence: EvidenceItem[];
  index: number;
  onInspect: () => void;
  related: boolean;
  selected: boolean;
  setRef: (node: HTMLButtonElement | null) => void;
}) {
  const [state, action, pending] = useActionState(
    updateContributingCauseAction.bind(null, caseId, cause.id),
    initialState,
  );
  const evidenceLabels = cause.evidenceIds
    .map((id) => evidence.findIndex((item) => item.id === id))
    .filter((itemIndex) => itemIndex >= 0)
    .map((itemIndex) => `E${itemIndex + 1}`);

  return (
    <article
      className={`rounded-2xl border bg-white p-4 transition dark:bg-slate-900 ${
        selected
          ? "border-emerald-800 ring-2 ring-emerald-800/20 dark:border-emerald-400"
          : "border-slate-200 dark:border-slate-800"
      } ${related ? "opacity-100" : "opacity-45"}`}
    >
      <button
        aria-label={`Periksa Faktor Penyebab C${index}: ${cause.content}`}
        aria-pressed={selected}
        className="flex w-full items-center justify-between gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/25"
        onClick={onInspect}
        ref={setRef}
        type="button"
      >
        <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          C{index}
        </span>
        {selected ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            Dipilih
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Periksa hubungan
          </span>
        )}
      </button>

      <form action={action} className="mt-3">
        <label className="sr-only" htmlFor={`cause-${cause.id}`}>
          Isi Faktor Penyebab C{index}
        </label>
        <textarea
          className="min-h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          defaultValue={cause.content}
          id={`cause-${cause.id}`}
          name="content"
          required
        />
        <EvidenceChoices
          checkedIds={cause.evidenceIds}
          evidence={evidence}
          legend={`Bukti yang mendukung C${index}`}
        />
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            Didukung oleh:
          </span>{" "}
          {evidenceLabels.length > 0
            ? evidenceLabels.join(", ")
            : "Belum ada Bukti yang dihubungkan."}
        </p>
        <Feedback state={state} />
        <button
          className="mt-3 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 disabled:cursor-wait disabled:opacity-70 dark:border-slate-700 dark:hover:bg-slate-800"
          disabled={pending}
          type="submit"
        >
          {pending ? "Menyimpan..." : "Simpan Faktor & Hubungan"}
        </button>
      </form>

      <RemoveCauseForm caseId={caseId} causeId={cause.id} />
    </article>
  );
}

function EvidenceChoices({
  checkedIds = [],
  evidence,
  legend,
}: {
  checkedIds?: string[];
  evidence: EvidenceItem[];
  legend: string;
}) {
  return (
    <fieldset className="mt-4">
      <legend className="text-sm font-semibold">{legend}</legend>
      {evidence.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Belum ada Bukti yang dapat dipilih.
        </p>
      ) : (
        <div className="mt-2 grid gap-2">
          {evidence.map((item, index) => (
            <label
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm leading-5 hover:border-emerald-700/50 dark:border-slate-700"
              key={item.id}
            >
              <input
                className="mt-1 size-4 accent-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/25"
                defaultChecked={checkedIds.includes(item.id)}
                name="evidenceIds"
                type="checkbox"
                value={item.id}
              />
              <span>
                <span className="font-semibold">E{index + 1}</span> —{" "}
                {item.content}
              </span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

function RemoveCauseForm({
  caseId,
  causeId,
}: {
  caseId: string;
  causeId: string;
}) {
  const [state, action, pending] = useActionState(
    removeContributingCauseAction.bind(null, caseId, causeId),
    initialState,
  );

  return (
    <form action={action} className="mt-3">
      <Feedback state={state} />
      <button
        className="rounded-xl px-3 py-2 text-sm font-semibold text-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-700/20 dark:text-red-300"
        disabled={pending}
        type="submit"
      >
        {pending ? "Menghapus..." : "Hapus Faktor Penyebab"}
      </button>
    </form>
  );
}

function Feedback({ state }: { state: CauseActionState }) {
  return (
    <div aria-live="polite" className="min-h-5 pt-2">
      {state.error ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-800 dark:text-emerald-300" role="status">
          {state.success}
        </p>
      ) : null}
    </div>
  );
}
