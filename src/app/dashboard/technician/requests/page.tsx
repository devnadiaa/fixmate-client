"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  LoaderCircle,
  MapPin,
  Search,
  User,
  Wrench,
  X,
} from "lucide-react";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Booking = {
  _id: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: string;
  finalAmount: number;
  paymentStatus: string;
  createdAt: string;
};

const statusOptions = [
  "all",
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

export default function TechnicianRequestsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    null
  );
  const [nextStatus, setNextStatus] = useState("");
  const [finalAmount, setFinalAmount] = useState("");

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

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);

      const session = await authClient.getSession();
      const user = session.data?.user as
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

      const response = await fetch(
        `${backendURL}/api/bookings/technician`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load booking requests.");
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
    loadBookings();
  }, [loadBookings]);

  const openStatusModal = (booking: Booking, status: string) => {
    setSelectedBooking(booking);
    setNextStatus(status);
    setFinalAmount(
      status === "completed" ? String(booking.finalAmount || "") : ""
    );
  };

  const updateStatus = async () => {
    if (!selectedBooking) return;

    if (
      nextStatus === "completed" &&
      (Number(finalAmount) <= 0 || Number.isNaN(Number(finalAmount)))
    ) {
      toast.error("Enter a valid final amount.");
      return;
    }

    try {
      setUpdatingId(selectedBooking._id);

      const token = await getToken();

      const body: {
        status: string;
        finalAmount?: number;
      } = {
        status: nextStatus,
      };

      if (nextStatus === "completed") {
        body.finalAmount = Number(finalAmount);
      }

      const response = await fetch(
        `${backendURL}/api/bookings/${selectedBooking._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed.");
      }

      toast.success(data.message || "Booking status updated.");
      setSelectedBooking(null);
      setNextStatus("");
      await loadBookings();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      booking.serviceTitle?.toLowerCase().includes(keyword) ||
      booking.customerName?.toLowerCase().includes(keyword) ||
      booking.customerEmail?.toLowerCase().includes(keyword) ||
      booking.customerPhone?.toLowerCase().includes(keyword);

    const matchesStatus =
      filter === "all" || booking.status === filter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      requested: "bg-amber-100 text-amber-700",
      accepted: "bg-blue-100 text-blue-700",
      "in-progress": "bg-violet-100 text-violet-700",
      completed: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      cancelled: "bg-slate-200 text-slate-600",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const formatStatus = (status: string) => {
    return status.replace("-", " ");
  };

  const formatDate = (date: string) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/technician"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Wrench size={25} />
          </div>

          <h1 className="text-3xl font-bold">Booking Requests</h1>

          <p className="mt-2 text-sm text-violet-100">
            Manage customer repair requests and update work progress.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total", value: bookings.length, status: "all" },
            {
              label: "Requested",
              value: bookings.filter((item) => item.status === "requested")
                .length,
              status: "requested",
            },
            {
              label: "Accepted",
              value: bookings.filter((item) => item.status === "accepted")
                .length,
              status: "accepted",
            },
            {
              label: "In Progress",
              value: bookings.filter((item) => item.status === "in-progress")
                .length,
              status: "in-progress",
            },
            {
              label: "Completed",
              value: bookings.filter((item) => item.status === "completed")
                .length,
              status: "completed",
            },
            {
              label: "Rejected",
              value: bookings.filter((item) => item.status === "rejected")
                .length,
              status: "rejected",
            },
          ].map((item) => (
            <button
              key={item.status}
              onClick={() => setFilter(item.status)}
              className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-violet-300 ${
                filter === item.status
                  ? "border-violet-500 ring-2 ring-violet-100"
                  : "border-slate-100"
              }`}
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {item.value}
              </h2>
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Search size={20} className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer or service..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Requests" : formatStatus(status)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle
              className="animate-spin text-violet-600"
              size={36}
            />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <CalendarDays
              className="mx-auto mb-4 text-slate-300"
              size={45}
            />

            <h2 className="text-xl font-bold text-slate-800">
              No Booking Requests Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Customer booking requests will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredBookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="h-48 bg-slate-100 sm:h-auto sm:w-44">
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {booking.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                      {booking.serviceTitle}
                    </h2>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <User size={16} className="text-violet-500" />
                        {booking.customerName}
                      </p>

                      <p className="break-all">{booking.customerEmail}</p>

                      <p>Phone: {booking.customerPhone}</p>

                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-violet-500" />
                        {booking.address}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-violet-500"
                        />
                        Preferred Date: {formatDate(booking.preferredDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 p-5">
                  <h3 className="mb-2 text-sm font-bold text-slate-800">
                    Customer Problem Description
                  </h3>

                  <p className="text-sm leading-6 text-slate-600">
                    {booking.problemDescription}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xs text-slate-500">Base Price</p>
                      <p className="text-lg font-bold text-violet-700">
                        ${Number(booking.basePrice).toFixed(2)}
                      </p>
                    </div>

                    {booking.status === "completed" && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Final Amount</p>
                        <p className="text-lg font-bold text-green-600">
                          ${Number(booking.finalAmount).toFixed(2)}
                        </p>
                        <p className="text-xs capitalize text-slate-500">
                          Payment: {booking.paymentStatus}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {booking.status === "requested" && (
                      <>
                        <button
                          onClick={() =>
                            openStatusModal(booking, "accepted")
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                        >
                          <CheckCircle size={17} />
                          Accept Request
                        </button>

                        <button
                          onClick={() =>
                            openStatusModal(booking, "rejected")
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                        >
                          <X size={17} />
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() =>
                          openStatusModal(booking, "in-progress")
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                      >
                        <Wrench size={17} />
                        Start Work
                      </button>
                    )}

                    {booking.status === "in-progress" && (
                      <button
                        onClick={() =>
                          openStatusModal(booking, "completed")
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                      >
                        <CheckCircle size={17} />
                        Mark Completed
                      </button>
                    )}

                    {booking.status === "completed" && (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-sm font-semibold text-green-700">
                        <CheckCircle size={18} />
                        Work Completed
                      </div>
                    )}

                    {(booking.status === "rejected" ||
                      booking.status === "cancelled") && (
                      <div className="w-full rounded-xl bg-slate-100 py-3 text-center text-sm font-semibold capitalize text-slate-500">
                        Request {booking.status}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {nextStatus === "completed"
                  ? "Complete Repair"
                  : "Confirm Status Update"}
              </h2>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Update booking status for{" "}
              <strong className="text-slate-900">
                {selectedBooking.serviceTitle}
              </strong>{" "}
              to{" "}
              <strong className="capitalize text-violet-700">
                {formatStatus(nextStatus)}
              </strong>
              ?
            </p>

            {nextStatus === "completed" && (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Final Amount (USD)
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={finalAmount}
                  onChange={(event) => setFinalAmount(event.target.value)}
                  placeholder="Enter final repair amount"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />

                <p className="mt-2 text-xs text-slate-500">
                  The customer will be able to pay after the repair is
                  completed.
                </p>
              </div>
            )}

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={updateStatus}
                disabled={updatingId === selectedBooking._id}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {updatingId === selectedBooking._id && (
                  <LoaderCircle className="animate-spin" size={17} />
                )}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}