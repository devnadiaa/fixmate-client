"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

type User = {
  role: string;
};

type Service = {
  approvalStatus: string;
};

type Booking = {
  status: string;
};

type ChartItem = {
  name: string;
  value: number;
};

const userColors = ["#8b5cf6", "#3b82f6", "#f59e0b"];
const serviceColors = ["#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTechnicians, setTotalTechnicians] = useState(0);
  const [pendingServices, setPendingServices] = useState(0);

  const [userData, setUserData] = useState<ChartItem[]>([]);
  const [serviceData, setServiceData] = useState<ChartItem[]>([]);
  const [bookingData, setBookingData] = useState<ChartItem[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const session = await authClient.getSession();
        const user = session.data?.user as
          | { role?: string }
          | undefined;

        if (user === undefined) {
          router.push("/sign-in");
          return;
        }

        if (user.role !== "admin") {
          toast.error("Admin access required.");
          router.push("/dashboard/customer");
          return;
        }

        const backendURL =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "http://localhost:5000";

        const tokenResponse = await fetch(
          `${backendURL}/api/auth/token`,
          {
            credentials: "include",
          }
        );

        const tokenData = await tokenResponse.json();

        if (
          tokenResponse.ok === false ||
          tokenData.token === undefined
        ) {
          toast.error("Authentication failed.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${tokenData.token}`,
        };

        const [
          usersResponse,
          servicesResponse,
          bookingsResponse,
        ] = await Promise.all([
          fetch(`${backendURL}/api/admin/users`, { headers }),
          fetch(`${backendURL}/api/admin/services`, { headers }),
          fetch(`${backendURL}/api/admin/bookings`, { headers }),
        ]);

        if (
          usersResponse.ok === false ||
          servicesResponse.ok === false ||
          bookingsResponse.ok === false
        ) {
          toast.error("Failed to load dashboard information.");
          return;
        }

        const users: User[] = await usersResponse.json();
        const services: Service[] = await servicesResponse.json();
        const bookings: Booking[] = await bookingsResponse.json();

        const customers = users.filter(
          (item) => item.role === "customer"
        ).length;

        const technicians = users.filter(
          (item) => item.role === "technician"
        ).length;

        const admins = users.filter(
          (item) => item.role === "admin"
        ).length;

        const pending = services.filter(
          (item) => item.approvalStatus === "pending"
        ).length;

        setTotalUsers(users.length);
        setTotalTechnicians(technicians);
        setPendingServices(pending);

        setUserData([
          { name: "Customers", value: customers },
          { name: "Technicians", value: technicians },
          { name: "Admins", value: admins },
        ]);

        setServiceData([
          {
            name: "Approved",
            value: services.filter(
              (item) => item.approvalStatus === "approved"
            ).length,
          },
          {
            name: "Pending",
            value: pending,
          },
          {
            name: "Rejected",
            value: services.filter(
              (item) => item.approvalStatus === "rejected"
            ).length,
          },
        ]);

        const bookingStatuses = [
          "requested",
          "accepted",
          "in-progress",
          "completed",
          "rejected",
          "cancelled",
        ];

        setBookingData(
          bookingStatuses.map((status) => ({
            name: status
              .split("-")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" "),
            value: bookings.filter(
              (item) => item.status === status
            ).length,
          }))
        );
      } catch {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const dashboardLinks = [
    {
      title: "Manage Users",
      description: "View users and manage their account roles.",
      href: "/dashboard/admin/users",
      icon: "👥",
    },
    {
      title: "Manage Services",
      description: "Review technician services and approve listings.",
      href: "/dashboard/admin/services",
      icon: "🔧",
    },
    {
      title: "Manage Bookings",
      description: "Monitor customer bookings and repair progress.",
      href: "/dashboard/admin/bookings",
      icon: "📋",
    },
    {
      title: "Manage Transactions",
      description: "View payments and monitor platform revenue.",
      href: "/dashboard/admin/transactions",
      icon: "💳",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-lg sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-200">
            FixMate Administration
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-violet-100">
            Manage users, review service listings, monitor bookings, and track
            platform transactions from one place.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Users
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
              {totalUsers}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Registered platform users
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Technicians
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
              {totalTechnicians}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Registered service providers
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Services
            </p>
            <h2 className="mt-3 text-4xl font-bold text-amber-600">
              {pendingServices}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Services waiting for approval
            </p>
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Platform Analytics
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Visual overview of users, services, and bookings.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                User Distribution
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Users grouped by account role
              </p>

              <div className="mt-5 h-72">
                {totalUsers > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={90}
                        innerRadius={48}
                        paddingAngle={3}
                      >
                        {userData.map((item, index) => (
                          <Cell
                            key={item.name}
                            fill={userColors[index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                    No user data available.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Service Approval Status
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Overview of submitted service listings
              </p>

              <div className="mt-5 h-72">
                {serviceData.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={90}
                        innerRadius={48}
                        paddingAngle={3}
                      >
                        {serviceData.map((item, index) => (
                          <Cell
                            key={item.name}
                            fill={serviceColors[index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                    No service data available.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Booking Status Overview
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Total bookings grouped by repair progress
              </p>

              <div className="mt-5 h-80">
                {bookingData.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bookingData}
                      margin={{
                        top: 10,
                        right: 15,
                        left: -15,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        name="Bookings"
                        fill="#8b5cf6"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={55}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                    No booking data available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Administration
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Choose an area to manage your FixMate platform.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {dashboardLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-violet-700 dark:text-violet-400">
                  Manage now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}