"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  Wrench,
  PlusCircle,
  ClipboardList,
  BriefcaseBusiness,
  UserRound,
  ArrowRight,
  LoaderCircle,
  CheckCircle,
  Clock,
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

type Service = {
  _id: string;
  approvalStatus: string;
};

const bookingStatuses = [
  { name: "Requested", color: "#F59E0B" },
  { name: "Accepted", color: "#3B82F6" },
  { name: "In Progress", color: "#8B5CF6" },
  { name: "Completed", color: "#16A34A" },
  { name: "Rejected", color: "#EF4444" },
  { name: "Cancelled", color: "#64748B" },
];

const serviceStatuses = [
  { name: "Approved", color: "#16A34A" },
  { name: "Pending", color: "#F59E0B" },
  { name: "Rejected", color: "#EF4444" },
];

export default function TechnicianDashboard() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "Technician";

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

      if (user.role !== "technician") {
        router.replace("/dashboard/customer");
        return;
      }

      const token = await getToken();

      const [bookingResponse, serviceResponse] = await Promise.all([
        fetch(`${backendURL}/api/bookings/technician`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),
        fetch(`${backendURL}/api/services/my-services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),
      ]);

      const [bookingData, serviceData] = await Promise.all([
        bookingResponse.json(),
        serviceResponse.json(),
      ]);

      if (!bookingResponse.ok) {
        throw new Error(
          bookingData.message || "Failed to load booking information."
        );
      }

      if (!serviceResponse.ok) {
        throw new Error(
          serviceData.message || "Failed to load service information."
        );
      }

      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
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

  const totalServices = services.length;

  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const pendingRequests = bookings.filter(
    (booking) => booking.status === "requested"
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

  const serviceChartData = serviceStatuses
    .map((status) => ({
      ...status,
      value: services.filter(
        (service) =>
          service.approvalStatus === status.name.toLowerCase()
      ).length,
    }))
    .filter((item) => item.value > 0);

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

  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      icon: BriefcaseBusiness,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Approved Services",
      value: approvedServices,
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-8">
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Overview
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              A summary of your services and customer requests.
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
              Manage Your Work
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
              Work Analytics
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Visual insights into your booking and service status.
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
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Job Status Overview
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Status of your customer repair bookings.
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
                          outerRadius={95}
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

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Service Approval Status
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Approval progress of your listed services.
                </p>

                {serviceChartData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                    No service data available.
                  </div>
                ) : (
                  <div className="mt-4 h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          label
                        >
                          {serviceChartData.map((item) => (
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
            </div>
          )}
        </section>
      </div>
    </main>
  );
}