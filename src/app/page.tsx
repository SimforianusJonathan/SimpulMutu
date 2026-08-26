import { revokeAccess } from "@/app/akses/actions";
import { requireSession } from "@/lib/access/current-session";

export default async function HomePage() {
  await requireSession();

  return (
    <main className="min-h-[100dvh] bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
          <div className="flex items-center gap-8">
            <span className="font-semibold tracking-tight">Memori Kualitas</span>
            <span className="hidden text-sm font-semibold text-emerald-800 sm:inline dark:text-emerald-300">
              Kasus Kualitas
            </span>
          </div>
          <form action={revokeAccess}>
            <button
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 active:translate-y-px dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              type="submit"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Kasus Kualitas
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Belum ada Kasus Kualitas
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Kasus Kualitas akan menjadi ruang kerja untuk memulai dan melanjutkan investigasi kualitas.
          </p>
        </div>

        <div className="mt-14 max-w-2xl border-t border-slate-300 pt-8 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Ruang kerja siap digunakan
          </p>
          <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
            Pembuatan Kasus Kualitas belum tersedia pada tahap fondasi ini.
          </p>
        </div>
      </section>
    </main>
  );
}
