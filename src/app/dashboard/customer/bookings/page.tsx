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
  CheckCircle2,
  Circle,
  AlertCircle,
  Star,
  Send,
  CreditCard,
} from "lucide-react";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type StatusHistory = {
  status: string;
  changedAt: string;
  note?: string;
};

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
  statusHistory?: StatusHistory[];
  createdAt: string;
};

const timelineSteps = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "paid",
];

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");
  const [payingId, setPayingId] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchBookings = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        if (showLoading) {
          toast.error("Please sign in to view your bookings.");
        }
        return;
      }

      const response = await fetch(`${backendURL}/api/bookings/my`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (showLoading) {
          toast.error(data.message || "Failed to load bookings.");
        }
        return;
      }

      setBookings(Array.isArray(data) ? data : []);
    } catch {
      if (showLoading) {
        toast.error("Something went wrong while loading bookings.");
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async (booking: Booking) => {
    if (payingId !== "") {
      return;
    }

    try {
      setPayingId(booking._id);

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        toast.error("Please sign in again.");
        return;
      }

      const response = await fetch(
        `${backendURL}/api/payments/create-checkout-session/${booking._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to start payment.");
        return;
      }

      if (!data.url) {
        toast.error("Payment checkout URL not found.");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong while starting payment.");
    } finally {
      setPayingId("");
    }
  };

  const handleCancel = async () => {
    if (cancelTarget === null) return;

    const bookingId = cancelTarget._id;

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
      setCancelTarget(null);
      setSelectedBooking(null);
      await fetchBookings();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCancellingId("");
    }
  };

  const handleSubmitReview = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (reviewTarget === null) return;

    if (comment.trim() === "") {
      toast.error("Please write your review.");
      return;
    }

    try {
      setSubmittingReview(true);

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        toast.error("Please sign in again.");
        return;
      }

      const response = await fetch(
        `${backendURL}/api/services/${reviewTarget.serviceId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            bookingId: reviewTarget._id,
            rating,
            comment: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to submit review.");
        return;
      }

      toast.success("Review submitted successfully.");

      setReviewTarget(null);
      setRating(5);
      setComment("");
    } catch {
      toast.error("Something went wrong while submitting your review.");
    } finally {
      setSubmittingReview(false);
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
      paid: "bg-emerald-100 text-emerald-700",
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
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimelineIndex = (booking: Booking) => {
    if (
      booking.status === "rejected" ||
      booking.status === "cancelled"
    ) {
      return -1;
    }

    if (
      booking.status === "completed" &&
      booking.paymentStatus === "paid"
    ) {
      return 4;
    }

    return timelineSteps.indexOf(booking.status);
  };

  const BookingTimeline = ({ booking }: { booking: Booking }) => {
    const currentIndex = getTimelineIndex(booking);

    if (currentIndex === -1) {
      return (
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle
              size={18}
              className={
                booking.status === "rejected"
                  ? "text-red-500"
                  : "text-slate-500"
              }
            />

            <p className="text-sm font-semibold text-slate-700">
              {booking.status === "rejected"
                ? "This booking request was rejected."
                : "This booking was cancelled."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6 rounded-xl bg-slate-50 p-4 sm:p-5">
        <h3 className="mb-5 text-sm font-bold text-slate-800">
          Booking Progress
        </h3>

        <div className="grid grid-cols-5 gap-1">
          {timelineSteps.map((step, index) => {
            const completed = index <= currentIndex;

            return (
              <div key={step} className="min-w-0 text-center">
                <div className="flex justify-center">
                  {completed ? (
                    <CheckCircle2
                      size={23}
                      className="text-emerald-600"
                    />
                  ) : (
                    <Circle size={23} className="text-slate-300" />
                  )}
                </div>

                <p
                  className={`mt-2 text-[10px] font-semibold sm:text-xs ${
                    completed ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {step === "in-progress"
                    ? "In Progress"
                    : formatStatus(step)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${(currentIndex / 4) * 100}%`,
            }}
          />
        </div>

        {booking.paymentStatus === "unpaid" &&
          booking.status === "completed" && (
            <p className="mt-3 text-xs font-medium text-amber-700">
              Your repair is completed. Payment is still pending.
            </p>
          )}
      </div>
    );
  };

  const counts = {
    all: bookings.length,
    requested: bookings.filter((booking) => booking.status === "requested").length,
    accepted: bookings.filter((booking) => booking.status === "accepted").length,
    inProgress: bookings.filter((booking) => booking.status === "in-progress").length,
    completed: bookings.filter((booking) => booking.status === "completed").length,
    rejected: bookings.filter((booking) => booking.status === "rejected").length,
    cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
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

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {[
            { label: "Total Bookings", value: counts.all },
            { label: "Requested", value: counts.requested },
            { label: "Accepted", value: counts.accepted },
            { label: "In Progress", value: counts.inProgress },
            { label: "Completed", value: counts.completed },
            { label: "Rejected", value: counts.rejected },
            { label: "Cancelled", value: counts.cancelled },
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
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by service or technician..."
            className="h-12 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
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

                    <BookingTimeline booking={booking} />

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

                        {booking.status === "completed" &&
                          booking.paymentStatus === "unpaid" && (
                            <button
                              type="button"
                              onClick={() => handlePayment(booking)}
                              disabled={payingId !== ""}
                              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {payingId === booking._id ? (
                                <LoaderCircle size={16} className="animate-spin" />
                              ) : (
                                <CreditCard size={16} />
                              )}
                              {payingId === booking._id
                                ? "Processing..."
                                : "Pay Now"}
                            </button>
                          )}

                        {booking.status === "completed" &&
                          booking.paymentStatus === "paid" && (
                            <button
                              type="button"
                              onClick={() => setReviewTarget(booking)}
                              className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                            >
                              <Star size={16} />
                              Write Review
                            </button>
                          )}

                        {booking.status === "requested" && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(booking)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            <XCircle size={16} />
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4">
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
              <BookingTimeline booking={selectedBooking} />

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
              {selectedBooking.status === "completed" &&
                selectedBooking.paymentStatus === "unpaid" && (
                  <button
                    type="button"
                    onClick={() => handlePayment(selectedBooking)}
                    disabled={payingId !== ""}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {payingId === selectedBooking._id ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <CreditCard size={17} />
                    )}
                    {payingId === selectedBooking._id
                      ? "Processing..."
                      : "Pay Now"}
                  </button>
                )}

              {selectedBooking.status === "requested" && (
                <button
                  type="button"
                  onClick={() => setCancelTarget(selectedBooking)}
                  className="rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
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

      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-violet-600">
                  Customer Review
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {reviewTarget.serviceTitle}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Share your experience with this repair service.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setReviewTarget(null);
                  setRating(5);
                  setComment("");
                }}
                disabled={submittingReview}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Your Rating
                </label>

                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(index + 1)}
                      className="transition hover:scale-110"
                      aria-label={`Rate ${index + 1} stars`}
                    >
                      <Star
                        size={32}
                        className={
                          index < rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {rating} out of 5 stars
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Your Review
                </label>

                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Write about your repair service experience..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setReviewTarget(null);
                    setRating(5);
                    setComment("");
                  }}
                  disabled={submittingReview}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingReview || comment.trim() === ""}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingReview ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Send size={17} />
                  )}

                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Cancel Booking?
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Are you sure you want to cancel your booking for{" "}
              <span className="font-semibold text-slate-900">
                {cancelTarget.serviceTitle}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={cancellingId !== ""}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={cancellingId === cancelTarget._id}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancellingId === cancelTarget._id && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {cancellingId === cancelTarget._id
                  ? "Cancelling..."
                  : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}