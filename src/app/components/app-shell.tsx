import Link from "next/link";
import type { ReactNode } from "react";

import { revokeAccess } from "@/app/akses/actions";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[100dvh] bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-5 sm:gap-8">
            <Link className="shrink-0 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20" href="/">Simpul Mutu</Link>
            <nav aria-label="Navigasi Kasus Kualitas" className="flex items-center gap-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Link className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20" href="/">Aktif</Link>
              <Link className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20" href="/kasus-kualitas/selesai">Selesai</Link>
              <Link className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20" href="/kasus-kualitas/baru">Buat Kasus Kualitas</Link>
            </nav>
          </div>
          <form action={revokeAccess}>
            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 active:translate-y-px dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" type="submit">Keluar</button>
          </form>
        </div>
      </header>
      {children}
    </main>
  );
}