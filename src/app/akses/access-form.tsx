"use client";

import { useActionState } from "react";

import { grantAccess, type AccessActionState } from "./actions";

const initialState: AccessActionState = {};

export function AccessForm() {
  const [state, formAction, pending] = useActionState(
    grantAccess,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 space-y-6">
      <div>
        <label
          className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
          htmlFor="credential"
        >
          Kredensial akses
        </label>
        <input
          autoComplete="current-password"
          autoFocus
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          id="credential"
          name="credential"
          placeholder="Masukkan kredensial"
          required
          type="password"
        />
      </div>

      <div aria-live="polite" className="min-h-6">
        {state.error ? (
          <p className="text-sm font-medium text-red-700 dark:text-red-300" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>

      <button
        className="w-full rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 active:translate-y-px disabled:cursor-wait disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        disabled={pending}
        type="submit"
      >
        {pending ? "Memeriksa akses..." : "Masuk ke aplikasi"}
      </button>
    </form>
  );
}
