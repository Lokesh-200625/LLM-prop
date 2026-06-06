import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111113] px-6 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/40">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-yellow-500">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          This route does not exist in the predictor app.
        </p>
        <Link
          className="mt-6 inline-flex rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-black transition hover:bg-yellow-400"
          href="/"
        >
          Back to predictor
        </Link>
      </section>
    </main>
  );
}
