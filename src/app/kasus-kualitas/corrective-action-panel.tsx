"use client";

import { useActionState } from "react";

import {
  addCorrectiveActionAction,
  type CorrectiveActionState,
  removeCorrectiveActionAction,
  updateCorrectiveActionAction,
} from "./corrective-action-actions";

type ActionItem = { id: string; content: string };

const initialState: CorrectiveActionState = {};

export function CorrectiveActionPanel({
  actions,
  caseId,
}: {
  actions: ActionItem[];
  caseId: string;
}) {
  return (
    <section className="max-w-3xl">
      <h2 className="text-2xl font-semibold tracking-tight">
        Tindakan Korektif
      </h2>
      <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
        Catat respons korektif yang akan dilakukan terhadap investigasi saat
        ini. Tahap ini tidak mengatur pemilik, tenggat, atau verifikasi hasil.
      </p>

      <NewActionForm caseId={caseId} />

      <div className="mt-8 space-y-4">
        {actions.length === 0 ? (
          <p className="border-y border-slate-200 py-5 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
            Belum ada Tindakan Korektif. Tambahkan setidaknya satu respons untuk
            melengkapi kesiapan penyelesaian.
          </p>
        ) : (
          actions.map((item, index) => (
            <ActionCard
              action={item}
              caseId={caseId}
              index={index + 1}
              key={item.id}
            />
          ))
        )}
      </div>
    </section>
  );
}

function NewActionForm({ caseId }: { caseId: string }) {
  const [state, action, pending] = useActionState(
    addCorrectiveActionAction.bind(null, caseId),
    initialState,
  );

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <label className="block text-sm font-semibold" htmlFor="new-corrective-action">
        Tindakan Korektif baru
      </label>
      <textarea
        className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
        id="new-corrective-action"
        name="content"
        placeholder="Contoh: Atur ulang tegangan benang pada mesin M-04 dan catat parameter yang digunakan."
        required
      />
      <Feedback state={state} />
      <button
        className="mt-3 rounded-xl bg-emerald-800 px-4 py-2 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 disabled:cursor-wait disabled:opacity-70 dark:bg-emerald-500 dark:text-emerald-950"
        disabled={pending}
        type="submit"
      >
        {pending ? "Menyimpan..." : "Tambah Tindakan Korektif"}
      </button>
    </form>
  );
}

function ActionCard({
  action: actionItem,
  caseId,
  index,
}: {
  action: ActionItem;
  caseId: string;
  index: number;
}) {
  const [state, action, pending] = useActionState(
    updateCorrectiveActionAction.bind(null, caseId, actionItem.id),
    initialState,
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        Tindakan {index}
      </p>
      <form action={action} className="mt-3">
        <label className="sr-only" htmlFor={`corrective-action-${actionItem.id}`}>
          Isi Tindakan Korektif {index}
        </label>
        <textarea
          className="min-h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          defaultValue={actionItem.content}
          id={`corrective-action-${actionItem.id}`}
          name="content"
          required
        />
        <Feedback state={state} />
        <button
          className="mt-3 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 disabled:cursor-wait disabled:opacity-70 dark:border-slate-700 dark:hover:bg-slate-800"
          disabled={pending}
          type="submit"
        >
          {pending ? "Menyimpan..." : "Simpan Tindakan Korektif"}
        </button>
      </form>
      <RemoveActionForm actionId={actionItem.id} caseId={caseId} />
    </article>
  );
}

function RemoveActionForm({
  actionId,
  caseId,
}: {
  actionId: string;
  caseId: string;
}) {
  const [state, action, pending] = useActionState(
    removeCorrectiveActionAction.bind(null, caseId, actionId),
    initialState,
  );

  return (
    <form action={action} className="mt-3">
      <Feedback state={state} />
      <button
        className="rounded-xl px-3 py-2 text-sm font-semibold text-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-700/20 disabled:cursor-wait disabled:opacity-70 dark:text-red-300"
        disabled={pending}
        type="submit"
      >
        {pending ? "Menghapus..." : "Hapus Tindakan Korektif"}
      </button>
    </form>
  );
}

function Feedback({ state }: { state: CorrectiveActionState }) {
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
