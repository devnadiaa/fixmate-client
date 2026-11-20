import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Clock,
  HeartHandshake,
  Target,
  Eye,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "We connect customers with skilled technicians who are committed to providing reliable repair services.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Our platform is designed to make finding and booking repair services simple and convenient.",
  },
  {
    icon: Clock,
    title: "Convenience",
    description:
      "Save time by exploring services, requesting repairs, and managing bookings in one place.",
  },
  {
    icon: HeartHandshake,
    title: "Supporting Technicians",
    description:
      "We help technicians showcase their skills, grow their repair business, and connect with customers.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="font-semibold uppercase tracking-wider text-blue-600">
            About FixMate
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Making Repair Services Easier for Everyone
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            FixMate is a service platform that connects people who need
            repairs with skilled technicians who provide them. We make
            finding, booking, and managing repair services easier and more
            convenient.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              Who We Are
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              One Platform, Two Opportunities
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              FixMate brings customers and repair professionals together.
              Customers can discover available services, book technicians,
              track repair progress, and manage payments.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              At the same time, technicians can create service listings,
              manage booking requests, complete repair jobs, and grow their
              professional presence through our platform.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Target size={25} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Our Mission
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                To make repair services accessible, convenient, and reliable
                for customers while creating opportunities for technicians.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Eye size={25} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Our Vision
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                To build a trusted platform where customers and skilled
                technicians can connect and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              What Matters to Us
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Core Values
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Everything we do is guided by our commitment to customers and
              technicians.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-blue-600 px-8 py-14 text-center sm:px-14">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Let's Make Repairs Easier Together
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Whether you need a repair or want to offer your professional
            services, FixMate is here to help you take the next step.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/services"
              className="rounded-xl bg-white px-7 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Find a Service
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl border border-white px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Join FixMate
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}