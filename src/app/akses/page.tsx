import { redirect } from "next/navigation";

import { hasValidSession } from "@/lib/access/current-session";
import { AccessForm } from "./access-form";

export default async function AccessPage() {
  if (await hasValidSession()) {
    redirect("/");
  }

  return (
    <main className="grid min-h-[100dvh] grid-cols-1 bg-slate-50 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.72fr)] dark:bg-slate-950">
      <section className="flex items-end bg-emerald-950 px-6 py-12 text-emerald-50 sm:px-10 lg:px-16 lg:py-16">
        <div className="max-w-xl">
          <p className="text-sm font-semibold tracking-wide text-emerald-300">
            Memori Kualitas
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Investigasi yang selesai menjadi pengalaman yang tetap berguna.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-emerald-100/80">
            Ruang kerja untuk menyusun investigasi kualitas dan menjaga pembelajaran tetap dapat ditelusuri.
          </p>
        </div>
      </section>

      <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Akses terbatas
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Masuk ke ruang investigasi
          </h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
            Gunakan kredensial aplikasi yang telah diberikan kepada tim Anda.
          </p>
          <AccessForm />
        </div>
      </section>
    </main>
  );
}
