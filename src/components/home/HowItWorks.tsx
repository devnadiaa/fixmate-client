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
            Getting your devices and home appliances repaired is easier than
            ever. Follow these four simple steps.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:bg-white hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <Icon size={28} />
                    </div>

                    <span className="text-3xl font-extrabold text-slate-200">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-blue-400 lg:block">
                    <ArrowRight size={22} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}