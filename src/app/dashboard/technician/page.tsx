"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Wrench,
  PlusCircle,
  ClipboardList,
  BriefcaseBusiness,
  UserRound,
  ArrowRight,
} from "lucide-react";

export default function TechnicianDashboard() {
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name || "Technician";

  const dashboardCards = [
    {
      title: "Add New Service",
      description: "Create a repair service and submit it for admin approval.",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "My Services",
      description: "View, edit and manage your listed repair services.",
      href: "/dashboard/technician/my-services",
      icon: BriefcaseBusiness,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Booking Requests",
      description: "Review customer requests and manage repair progress.",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Update Profile",
      description: "Manage your contact information and profile details.",
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
              Technician Dashboard
            </span>

            <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">
              Welcome back, {userName}!
            </h1>

            <p className="mt-4 max-w-xl leading-7 text-purple-100">
              Manage your repair services, respond to customer requests, and
              keep track of your repair jobs with FixMate.
            </p>

            <Link
              href="/dashboard/technician/add-service"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-violet-800 transition hover:bg-purple-100"
            >
              Add New Service
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Manage Your Work
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Quick access to your technician activities.
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
      </div>
    </main>
  );
}