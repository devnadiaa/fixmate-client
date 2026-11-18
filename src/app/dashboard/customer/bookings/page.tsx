"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  CalendarDays,
  MapPin,
  Phone,
  Clock,
  Package,
  XCircle,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage?: string;
  category: string;
  basePrice: number;
  finalAmount: number;
  technicianName: string;
  technicianEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        toast.error("Please sign in to view your bookings.");
        return;
      }

      const response = await fetch(`${backendURL}/api/bookings/my`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to load bookings.");
        return;
      }

      setBookings(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Something went wrong while loading bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        toast.error("Please sign in again.");
        return;
      }

      const response = await fetch(
        `${backendURL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to cancel booking.");
        return;
      }

      toast.success("Booking cancelled successfully.");
      setSelectedBooking(null);
      await fetchBookings();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCancellingId("");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter =
      filter === "all" || booking.status === filter;

    const matchesSearch =
      booking.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
      booking.technicianName.toLowerCase().includes(search.toLowerCase()) ||
      booking.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      requested: "bg-amber-100 text-amber-700",
      accepted: "bg-blue-100 text-blue-700",
      "in-progress": "bg-violet-100 text-violet-700",
      completed: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      cancelled: "bg-slate-100 text-slate-600",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const counts = {
    all: bookings.length,
    requested: bookings.filter((booking) => booking.status === "requested").length,
    accepted: bookings.filter((booking) => booking.status === "accepted").length,
    inProgress: bookings.filter((booking) => booking.status === "in-progress").length,
    completed: bookings.filter((booking) => booking.status === "completed").length,
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              Customer Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              My Bookings
            </h1>

            <p className="mt-2 text-slate-500">
              Track and manage your repair service requests.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Browse Services
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Total Bookings", value: counts.all },
            { label: "Requested", value: counts.requested },
            { label: "Accepted", value: counts.accepted },
            { label: "In Progress", value: counts.inProgress },
            { label: "Completed", value: counts.completed },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service or technician..."
            className="h-12 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-500"
          >
            <option value="all">All Bookings</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle className="animate-spin text-violet-600" size={36} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
            <Package className="mx-auto text-slate-300" size={52} />

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              {bookings.length === 0
                ? "No Bookings Yet"
                : "No Matching Bookings"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {bookings.length === 0
                ? "You haven't requested any repair services yet."
                : "Try changing your search or filter."}
            </p>

            {bookings.length === 0 && (
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                Explore Services
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
                  <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-36 sm:w-40">
                    {booking.serviceImage ? (
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <Package size={42} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                          {booking.category}
                        </span>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                          {booking.serviceTitle}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Technician: {booking.technicianName}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-violet-500" />
                        Preferred: {formatDate(booking.preferredDate)}
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone size={16} className="text-violet-500" />
                        {booking.customerPhone}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="shrink-0 text-violet-500" />
                        <span className="truncate">{booking.address}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock size={16} className="text-violet-500" />
                        Submitted: {formatDate(booking.createdAt)}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Final Amount</p>
                        <p className="text-xl font-extrabold text-slate-900">
                          ${booking.finalAmount ?? booking.basePrice}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-lg border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                        >
                          View Details
                        </button>

                        {booking.status === "requested" && (
                          <button
                            type="button"
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {cancellingId === booking._id ? (
                              <LoaderCircle size={16} className="animate-spin" />
                            ) : (
                              <XCircle size={16} />
                            )}
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-violet-600">
                  Booking Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedBooking.serviceTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Problem Description
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {selectedBooking.problemDescription}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Technician
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedBooking.technicianName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedBooking.technicianEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Payment Status
                  </p>
                  <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                    {selectedBooking.paymentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Preferred Date
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {formatDate(selectedBooking.preferredDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Booking Status
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                      selectedBooking.status
                    )}`}
                  >
                    {formatStatus(selectedBooking.status)}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Service Address
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {selectedBooking.address}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Customer Phone
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {selectedBooking.customerPhone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Amount
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    ${selectedBooking.finalAmount ?? selectedBooking.basePrice}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap justify-end gap-3">
              {selectedBooking.status === "requested" && (
                <button
                  type="button"
                  onClick={() => handleCancel(selectedBooking._id)}
                  disabled={cancellingId === selectedBooking._id}
                  className="rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  Cancel Booking
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}