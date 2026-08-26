"use client";

import { useActionState } from "react";

import {
  type RootCauseActionState,
  updateWorkingRootCauseAction,
} from "./root-cause-actions";

const initialState: RootCauseActionState = {};

export function RootCausePanel({
  caseId,
  contributingCauseCount,
  evidenceCount,
  workingRootCause,
}: {
  caseId: string;
  contributingCauseCount: number;
  evidenceCount: number;
  workingRootCause: string | null;
}) {
  const [state, action, pending] = useActionState(
    updateWorkingRootCauseAction.bind(null, caseId),
    initialState,
  );

  return (
    <section className="max-w-3xl">
      <h2 className="text-2xl font-semibold tracking-tight">
        Dugaan Akar Penyebab
      </h2>
      <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
        Tetapkan satu kesimpulan kerja untuk investigasi saat ini. Kesimpulan
        ini dapat direvisi selama Kasus Kualitas masih aktif.
      </p>

      <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
        <p className="font-semibold">Kesimpulan sementara, bukan fakta terbukti.</p>
        <p className="mt-2 text-sm leading-6">
          Tinjau kembali {evidenceCount} Bukti dan {contributingCauseCount} Faktor
          Penyebab sebelum menyimpan atau mengubah dugaan ini.
        </p>
      </div>

      <form action={action} className="mt-6">
        <label className="block text-sm font-semibold" htmlFor="working-root-cause">
          Kesimpulan kerja saat ini
        </label>
        <textarea
          className="mt-2 min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-700/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          defaultValue={workingRootCause ?? ""}
          id="working-root-cause"
          name="content"
          placeholder="Contoh: Tegangan benang pada mesin M-04 perlu distabilkan karena pola Bukti dan Faktor yang dicatat."
          required
        />
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Gunakan bahasa yang menunjukkan dugaan saat ini, bukan kepastian sebab.
        </p>
        <Feedback state={state} />
        <button
          className="mt-3 rounded-xl bg-amber-800 px-4 py-2 font-semibold text-white transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-700/30 disabled:cursor-wait disabled:opacity-70 dark:bg-amber-400 dark:text-amber-950"
          disabled={pending}
          type="submit"
        >
          {pending
            ? "Menyimpan..."
            : workingRootCause
              ? "Perbarui Dugaan Akar Penyebab"
              : "Simpan Dugaan Akar Penyebab"}
        </button>
      </form>
    </section>
  );
}

function Feedback({ state }: { state: RootCauseActionState }) {
  return (
    <div aria-live="polite" className="min-h-5 pt-3">
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
