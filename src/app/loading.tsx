import { LoaderCircle, Wrench } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100">
          <Wrench size={34} className="text-violet-600" />
          <LoaderCircle
            size={84}
            className="absolute animate-spin text-violet-500"
            strokeWidth={1.5}
          />
        </div>

        <h2 className="mt-7 text-xl font-bold text-slate-800">
          Loading FixMate...
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Please wait while we prepare everything for you.
        </p>
      </div>
    </main>
  );
}