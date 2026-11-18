"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  CalendarCheck,
  CreditCard,
  Search,
  UserRound,
  ArrowRight,
  Wrench,
  ClipboardList,
} from "lucide-react";

export default function CustomerDashboard() {
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name || "Customer";

  const dashboardCards = [
    {
      title: "Browse Services",
      description: "Find trusted technicians for your repair needs.",
      href: "/services",
      icon: Search,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "My Bookings",
      description: "View and manage your repair requests.",
      href: "/dashboard/customer/bookings",
      icon: CalendarCheck,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "My Payments",
      description: "Check your payment history and transactions.",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Update Profile",
      description: "Manage your personal information.",
      href: "/dashboard/profile",
      icon: UserRound,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-900 p-8 text-white shadow-lg sm:p-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-purple-100">
              <Wrench size={16} />
              Customer Dashboard
            </span>

            <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">
              Welcome back, {userName}!
            </h1>

            <p className="mt-4 max-w-xl leading-7 text-purple-100">
              Manage your repair requests, track bookings, and connect with
              trusted technicians through FixMate.
            </p>

            <Link
              href="/services"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-violet-800 transition hover:bg-purple-100"
            >
              Explore Services
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Quick Access
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Everything you need to manage your repair services.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                    {card.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-600">
                    Open
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <ClipboardList size={25} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Need a Repair Service?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Browse available repair services and send a booking request
                  to a technician.
                </p>
              </div>
            </div>

            <Link
              href="/services"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
            >
              Find a Technician
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}