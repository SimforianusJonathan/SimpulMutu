"use client";

import { useActionState } from "react";

import {
  resolveQualityCaseAction,
  type ResolveActionState,
} from "./resolve-actions";

const initialState: ResolveActionState = {};

export function ResolveCaseForm({ caseId }: { caseId: string }) {
  const [state, action, pending] = useActionState(
    resolveQualityCaseAction.bind(null, caseId),
    initialState,
  );

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-emerald-800/20 bg-emerald-50 p-5 dark:border-emerald-400/20 dark:bg-emerald-950/30"
    >
      <p className="font-semibold">Kasus Kualitas siap diselesaikan.</p>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
        Setelah diselesaikan, investigasi ini menjadi Memori Kualitas baca-saja.
      </p>
      <div aria-live="polite" className="min-h-5 pt-3">
        {state.error ? (
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
      <button
        className="rounded-xl bg-emerald-800 px-4 py-2 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 disabled:cursor-wait disabled:opacity-70 dark:bg-emerald-500 dark:text-emerald-950"
        disabled={pending}
        type="submit"
      >
        {pending ? "Menyelesaikan..." : "Selesaikan Kasus"}
      </button>
    </form>
  );
}