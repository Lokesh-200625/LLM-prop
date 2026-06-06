"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-[#111113] px-6 text-slate-100">
          <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/40">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-yellow-500">
              Application error
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-white">The app needs a refresh</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {error.message || "A required app boundary failed to load."}
            </p>
            <button
              className="mt-6 rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-black transition hover:bg-yellow-400"
              onClick={reset}
              type="button"
            >
              Reload
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
