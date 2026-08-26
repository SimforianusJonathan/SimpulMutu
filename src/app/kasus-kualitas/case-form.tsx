"use client";

import { useActionState, useSyncExternalStore } from "react";

import type { QualityCaseActionState } from "./actions";

type CaseFormValues = {
  problem: string;
  productionStage: string | null;
  productModelReference: string | null;
  material: string | null;
  machineWorkstation: string | null;
  batchOrderReference: string | null;
  additionalContextNote: string | null;
};

type QualityCaseFormProps = {
  action: (state: QualityCaseActionState, formData: FormData) => Promise<QualityCaseActionState>;
  submitLabel: string;
  values?: CaseFormValues;
};

const initialState: QualityCaseActionState = {};
const valueOrEmpty = (value: string | null | undefined): string => value ?? "";

export function QualityCaseForm({ action, submitLabel, values }: QualityCaseFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <form action={formAction} className="mt-10 space-y-8">
      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-slate-950 dark:text-slate-50">Masalah &amp; Konteks</legend>
        <p className="-mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Mulai dari hal yang diketahui. Konteks yang belum tersedia boleh dibiarkan kosong dan dapat dilengkapi saat investigasi berlangsung.</p>
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="problem">Masalah</label>
          <textarea autoFocus={!values} className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20" defaultValue={values?.problem} id="problem" name="problem" placeholder="Jelaskan masalah kualitas yang sedang terjadi" required />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Tahap Produksi / Proses" name="productionStage" value={values?.productionStage} />
          <Field label="Referensi Produk / Model" name="productModelReference" value={values?.productModelReference} />
          <Field label="Material" name="material" value={values?.material} />
          <Field label="Mesin / Workstation" name="machineWorkstation" value={values?.machineWorkstation} />
          <Field label="Referensi Batch / Pesanan" name="batchOrderReference" value={values?.batchOrderReference} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="additionalContextNote">Catatan Konteks Tambahan</label>
          <textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20" defaultValue={valueOrEmpty(values?.additionalContextNote)} id="additionalContextNote" name="additionalContextNote" placeholder="Tambahkan konteks lain jika tersedia" />
        </div>
      </fieldset>
      <div aria-live="polite" className="min-h-6">
        {state.error ? <p className="text-sm font-medium text-red-700 dark:text-red-300" role="alert">{state.error}</p> : null}
        {state.success ? <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300" role="status">{state.success}</p> : null}
      </div>
      <button className="rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 active:translate-y-px disabled:cursor-wait disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400" disabled={pending || !isHydrated} type="submit">{pending ? "Menyimpan Kasus Kualitas..." : !isHydrated ? "Menyiapkan formulir..." : submitLabel}</button>
    </form>
  );
}

function Field({ label, name, value }: { label: string; name: string; value?: string | null }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor={name}>{label}</label>
      <input className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus-visible:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20" defaultValue={valueOrEmpty(value)} id={name} name={name} placeholder="Belum diketahui (opsional)" type="text" />
    </div>
  );
}