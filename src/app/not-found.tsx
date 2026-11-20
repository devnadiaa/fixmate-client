import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
  Wrench,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-16">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="relative w-full max-w-3xl">
        <div className="rounded-[2rem] border border-white bg-white/80 px-6 py-12 text-center shadow-xl shadow-violet-100/60 backdrop-blur-xl sm:px-12 sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-sm">
            <Wrench size={30} />
          </div>

          <p className="mt-8 text-8xl font-black tracking-tighter text-violet-600 sm:text-9xl">
            404
          </p>

          <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />

          <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Oops! Page Not Found
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
            The page you're looking for doesn't exist, has been moved, or is
            temporarily unavailable. Let's get you back on track!
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl"
            >
              <Home size={18} />
              Back to Home
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              <Search size={18} />
              Browse Services
            </Link>
          </div>

          <div className="mt-12 border-t border-slate-100 pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-violet-600"
            >
              <ArrowLeft size={15} />
              Return to FixMate Homepage
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-medium tracking-wide text-slate-400">
          FIXMATE · SMART REPAIR SERVICE PLATFORM
        </p>
      </div>
    </main>
  );
}