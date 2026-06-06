"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111113] px-6 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/40">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-yellow-500">
          Something went wrong
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Unable to render this page</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {error.message || "The app hit an unexpected error."}
        </p>
        <button
          className="mt-6 rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-black transition hover:bg-yellow-400"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
