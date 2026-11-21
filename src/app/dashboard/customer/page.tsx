"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  CalendarCheck,
  CreditCard,
  Search,
  UserRound,
  ArrowRight,
  Wrench,
  ClipboardList,
  BriefcaseBusiness,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Booking = {
  _id: string;
  status: string;
};

const bookingStatuses = [
  { name: "Requested", color: "#F59E0B" },
  { name: "Accepted", color: "#3B82F6" },
  { name: "In Progress", color: "#8B5CF6" },
  { name: "Completed", color: "#16A34A" },
  { name: "Rejected", color: "#EF4444" },
  { name: "Cancelled", color: "#64748B" },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "Customer";

  const getToken = async () => {
    const response = await fetch(`${backendURL}/api/auth/token`, {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
      throw new Error("Please sign in again.");
    }

    return data.token as string;
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const sessionResponse = await authClient.getSession();
      const user = sessionResponse.data?.user as
        | { role?: string }
        | undefined;

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      if (user.role !== "customer") {
        router.replace("/dashboard/technician");
        return;
      }

      const token = await getToken();

      const response = await fetch(`${backendURL}/api/bookings/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load booking information.");
      }

      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const totalRequests = bookings.length;

  const activeJobs = bookings.filter((booking) =>
    ["requested", "accepted", "in-progress"].includes(booking.status)
  ).length;

  const completedJobs = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const bookingChartData = bookingStatuses
    .map((status) => ({
      ...status,
      value: bookings.filter(
        (booking) =>
          booking.status === status.name.toLowerCase().replace(" ", "-")
      ).length,
    }))
    .filter((item) => item.value > 0);

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

  const stats = [
    {
      title: "Total Requests",
      value: totalRequests,
      icon: ClipboardList,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: BriefcaseBusiness,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Completed Jobs",
      value: completedJobs,
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-8">
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Overview
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              A summary of your repair requests and job progress.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-36 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <LoaderCircle
                className="animate-spin text-violet-600"
                size={36}
              />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          {stat.title}
                        </p>

                        <h3 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
                          {stat.value}
                        </h3>
                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                      >
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Quick Access
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-700"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {card.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400">
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

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Booking Analytics
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Visual overview of your repair booking status.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <LoaderCircle
                className="animate-spin text-violet-600"
                size={36}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Booking Status Overview
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Track the progress of your repair requests.
              </p>

              {bookingChartData.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  No booking data available.
                </div>
              ) : (
                <div className="mt-4 h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {bookingChartData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <ClipboardList size={25} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Need a Repair Service?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
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