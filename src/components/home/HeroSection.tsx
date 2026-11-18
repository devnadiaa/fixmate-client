import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Wrench,
  CheckCircle2,
  Star,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28 lg:gap-20">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
            <Wrench size={16} />
            Smart Repair Service Platform
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Expert Repairs.
            <span className="mt-2 block text-blue-400">
              Trusted Solutions.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
            From smartphones to home appliances, find skilled technicians
            and get your devices repaired with confidence. Quality service
            is just a booking away.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Explore Services
              <ArrowRight size={19} />
            </Link>

            <Link
              href="/about"
              className="rounded-xl border border-slate-600 px-7 py-4 font-semibold text-white transition hover:border-blue-400 hover:bg-blue-400/10"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-7 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Trusted Technicians
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Skilled professionals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Easy Booking
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Simple and convenient
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-blue-500/20 blur-3xl" />

          <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
            <div className="relative h-[340px] overflow-hidden rounded-[1.5rem] sm:h-[440px]">
              <img
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85"
                alt="Professional technician repairing electronic equipment"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />

              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm font-medium text-blue-300">
                  YOUR REPAIR PARTNER
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  We Fix It. You Relax.
                </h2>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-12 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl sm:-left-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Quality Service
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Reliable solutions
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 right-3 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl sm:-right-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/15 text-yellow-400">
                <Star size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Customer First
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Service you can trust
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}