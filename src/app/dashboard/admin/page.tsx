"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

type User = {
  role: string;
};

type Service = {
  approvalStatus: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTechnicians, setTotalTechnicians] = useState(0);
  const [pendingServices, setPendingServices] = useState(0);

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

        if (tokenResponse.ok === false || tokenData.token === undefined) {
          toast.error("Authentication failed.");
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${tokenData.token}`,
        };

        const [usersResponse, servicesResponse] = await Promise.all([
          fetch(`${backendURL}/api/admin/users`, { headers }),
          fetch(`${backendURL}/api/admin/services`, { headers }),
        ]);

        if (usersResponse.ok === false || servicesResponse.ok === false) {
          toast.error("Failed to load dashboard information.");
          setLoading(false);
          return;
        }

        const users: User[] = await usersResponse.json();
        const services: Service[] = await servicesResponse.json();

        setTotalUsers(users.length);
        setTotalTechnicians(
          users.filter((item) => item.role === "technician").length
        );
        setPendingServices(
          services.filter((item) => item.approvalStatus === "pending").length
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
        <p className="text-lg font-medium text-slate-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              {totalUsers}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Registered platform users
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Technicians
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              {totalTechnicians}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Registered service providers
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Services
            </p>
            <h2 className="mt-3 text-4xl font-bold text-amber-600">
              {pendingServices}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Services waiting for approval
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Administration
            </h2>
            <p className="mt-2 text-slate-500">
              Choose an area to manage your FixMate platform.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {dashboardLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-violet-700">
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