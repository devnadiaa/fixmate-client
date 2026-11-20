import Link from "next/link";
import {
  Search,
  CalendarCheck,
  Wrench,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Services",
    description:
      "Browse repair services and find the right solution for your device or appliance.",
    icon: Search,
  },
  {
    number: "02",
    title: "Book a Service",
    description:
      "Choose your preferred service, provide your details, and submit a repair request.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Get It Repaired",
    description:
      "Connect with a skilled technician and get your repair job completed.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Complete Payment",
    description:
      "Review the final repair amount and securely complete your payment.",
    icon: CheckCircle,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-semibold uppercase tracking-wider text-blue-600">
            Simple Process
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            How FixMate Works
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Getting your devices repaired or growing your repair business is
            easier than ever with FixMate. Whether you're looking for a
            trusted technician or offering professional repair services,
            our platform makes the entire process simple and convenient.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={27} />
                  </div>

                  <span className="text-4xl font-bold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Learn More About the Process
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}