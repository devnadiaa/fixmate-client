"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw, Wrench } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-16">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="relative w-full max-w-3xl rounded-[2rem] border border-white bg-white/90 px-6 py-12 text-center shadow-xl shadow-violet-100/60 backdrop-blur-xl sm:px-12 sm:py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertTriangle size={30} />
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Wrench size={34} className="text-violet-500" />
          <span className="text-5xl font-black tracking-tight text-violet-600">
            Oops!
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Something Went Wrong
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
          An unexpected error occurred while loading this page. Please try
          again or return to the FixMate homepage.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

        <p className="mt-12 border-t border-slate-100 pt-6 text-xs font-medium tracking-wide text-slate-400">
          FIXMATE · SMART REPAIR SERVICE PLATFORM
        </p>
      </div>
    </main>
  );
}