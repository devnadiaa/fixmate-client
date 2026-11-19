"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Search,
  Wrench,
} from "lucide-react";

type Booking = {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  category?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  technicianName: string;
  technicianEmail: string;
  preferredDate: string;
  address: string;
  status: string;
  paymentStatus: string;
  basePrice: number;
  finalAmount: number;
  createdAt: string;
};

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);

      const session = await authClient.getSession();
      const user = session.data?.user as
        | { role?: string }
        | undefined;

      if (user?.role !== "admin") {
        toast.error("Only administrators can access this page.");
        return;
      }

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok === false || tokenData.token === undefined) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      const response = await fetch(`${backendURL}/api/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (response.ok === false) {
        throw new Error(data.message || "Failed to load bookings.");
      }

      setBookings(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        booking.serviceTitle?.toLowerCase().includes(keyword) ||
        booking.customerName?.toLowerCase().includes(keyword) ||
        booking.customerEmail?.toLowerCase().includes(keyword) ||
        booking.technicianName?.toLowerCase().includes(keyword) ||
        booking.technicianEmail?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const statusStyle = (status: string) => {
    const styles: Record<string, string> = {
      requested: "bg-blue-100 text-blue-700",
      accepted: "bg-indigo-100 text-indigo-700",
      "in-progress": "bg-amber-100 text-amber-700",
      completed: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      cancelled: "bg-slate-200 text-slate-700",
    };

    return styles[status] || "bg-slate-100 text-slate-700";
  };

  const paymentStyle = (status: string) => {
    return status === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-amber-100 text-amber-700";
  };

  const formatDate = (date: string) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    if (!status) return "Unknown";

    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const totalAmount = bookings.reduce(
    (total, booking) => total + Number(booking.finalAmount || booking.basePrice || 0),
    0
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const requestedBookings = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-600">
            <ClipboardList size={18} />
            Administration
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Manage Bookings
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor customer bookings and track repair progress across FixMate.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Bookings
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {bookings.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Requested
            </p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {requestedBookings}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {completedBookings}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Booking Value
            </p>
            <h2 className="mt-2 text-3xl font-bold text-violet-600">
              ${totalAmount.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search service, customer or technician..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500"
            >
              <option value="all">All Status</option>
              <option value="requested">Requested</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="mt-4 text-sm text-slate-500">
              Loading bookings...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <CalendarDays size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No Bookings Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {bookings.length === 0
                ? "Customer bookings will appear here when someone requests a service."
                : "Try changing your search or status filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 p-5 lg:flex-row">
                  <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-48 lg:h-36 lg:w-48">
                    {booking.serviceImage ? (
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <Wrench size={35} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {booking.serviceTitle}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(booking.status)}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {booking.category || "Repair Service"}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Customer
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {booking.customerName}
                        </p>
                        <p className="break-all text-xs text-slate-500">
                          {booking.customerEmail}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.customerPhone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Technician
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {booking.technicianName}
                        </p>
                        <p className="break-all text-xs text-slate-500">
                          {booking.technicianEmail}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Booking Date
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatDate(booking.preferredDate)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Created: {formatDate(booking.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Service Address</p>
                        <p className="mt-1 text-sm text-slate-700">
                          {booking.address || "Not provided"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${paymentStyle(booking.paymentStatus)}`}
                        >
                          {formatStatus(booking.paymentStatus || "unpaid")}
                        </span>

                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            {booking.status === "completed"
                              ? "Final Amount"
                              : "Base Price"}
                          </p>
                          <p className="text-lg font-bold text-violet-700">
                            $
                            {Number(
                              booking.finalAmount || booking.basePrice || 0
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <p className="mt-5 text-sm text-slate-500">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        )}
      </div>
    </main>
  );
}