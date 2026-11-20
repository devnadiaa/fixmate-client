"use client";

import Link from "next/link";
import {
  Search,
  CalendarCheck,
  Wrench,
  CheckCircle,
  CreditCard,
  Star,
  ClipboardList,
  UserPlus,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const customerSteps = [
  {
    icon: Search,
    title: "Find a Service",
    description:
      "Browse available repair services and choose the right technician for your device or home appliance.",
  },
  {
    icon: CalendarCheck,
    title: "Book a Service",
    description:
      "Select your preferred date, provide your contact details, and describe the problem you are facing.",
  },
  {
    icon: Wrench,
    title: "Get Your Device Repaired",
    description:
      "The technician reviews your request, accepts the booking, and works on your repair.",
  },
  {
    icon: CreditCard,
    title: "Complete Payment",
    description:
      "Once the repair is completed, review the final amount and complete your payment securely.",
  },
  {
    icon: Star,
    title: "Share Your Experience",
    description:
      "After payment, leave a rating and review to help other customers choose reliable technicians.",
  },
];

const technicianSteps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    description:
      "Register as a technician and complete your profile with your professional information.",
  },
  {
    icon: ClipboardList,
    title: "Add Your Services",
    description:
      "List your repair services with descriptions, pricing, images, and service availability.",
  },
  {
    icon: ShieldCheck,
    title: "Get Service Approval",
    description:
      "Your submitted services are reviewed by the admin before becoming publicly available.",
  },
  {
    icon: CalendarCheck,
    title: "Manage Booking Requests",
    description:
      "Receive customer requests, review booking details, and accept or reject requests.",
  },
  {
    icon: CheckCircle,
    title: "Complete Repair Jobs",
    description:
      "Update job progress, mark completed repairs, and receive payment from customers.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold">
            Simple. Reliable. Convenient.
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            How FixMate Works
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
            Getting your devices and home appliances repaired has never been
            easier. Follow a few simple steps to get started with FixMate.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-semibold text-blue-600">
            FOR CUSTOMERS
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Get Your Repair Done in 5 Easy Steps
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            From finding the right technician to completing your payment,
            FixMate makes the entire repair journey simple.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {customerSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={27} />
                  </div>

                  <span className="text-4xl font-bold text-slate-100">
                    0{index + 1}
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
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="font-semibold text-blue-600">
              FOR TECHNICIANS
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Grow Your Repair Business with FixMate
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Join our platform, showcase your expertise, connect with
              customers, and manage your repair jobs in one place.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {technicianSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon size={27} />
                    </div>

                    <span className="text-4xl font-bold text-slate-200">
                      0{index + 1}
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
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-blue-600 px-8 py-14 text-center text-white md:px-14">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Get Started?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
            Find trusted repair services or join FixMate as a technician
            and become part of our growing community.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/services"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Find a Service
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl border border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Join as a Technician
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}