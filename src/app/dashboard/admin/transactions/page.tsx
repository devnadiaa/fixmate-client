"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  CreditCard,
  Search,
  LoaderCircle,
  Wallet,
  CheckCircle,
  CalendarDays,
  Receipt,
} from "lucide-react";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Payment = {
  _id: string;
  bookingId: string;
  sessionId?: string;
  stripeSessionId?: string;
  transactionId?: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  createdAt?: string;
  paidAt?: string;
};

type Booking = {
  _id: string;
  serviceTitle?: string;
  customerName?: string;
  customerEmail?: string;
  technicianName?: string;
  technicianEmail?: string;
};

export default function AdminTransactionsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const getToken = async () => {
    const response = await fetch(`${backendURL}/api/auth/token`, {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
      throw new Error("Authentication token not found. Please sign in again.");
    }

    return data.token as string;
  };

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const session = await authClient.getSession();
      const user = session.data?.user as { role?: string } | undefined;

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      if (user.role !== "admin") {
        router.replace("/dashboard/customer");
        return;
      }

      const token = await getToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [paymentResponse, bookingResponse] = await Promise.all([
        fetch(`${backendURL}/api/admin/payments`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${backendURL}/api/admin/bookings`, {
          headers,
          cache: "no-store",
        }),
      ]);

      const paymentData = await paymentResponse.json();
      const bookingData = await bookingResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message || "Failed to load transactions."
        );
      }

      if (!bookingResponse.ok) {
        throw new Error(bookingData.message || "Failed to load bookings.");
      }

      setPayments(Array.isArray(paymentData) ? paymentData : []);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const getBooking = (bookingId: string) => {
    return bookings.find((booking) => booking._id === bookingId);
  };

  const filteredPayments = payments.filter((payment) => {
    const booking = getBooking(payment.bookingId);
    const keyword = search.toLowerCase();

    const matchesSearch =
      payment.customerEmail?.toLowerCase().includes(keyword) ||
      payment.transactionId?.toLowerCase().includes(keyword) ||
      payment.bookingId?.toLowerCase().includes(keyword) ||
      booking?.serviceTitle?.toLowerCase().includes(keyword) ||
      booking?.technicianName?.toLowerCase().includes(keyword) ||
      booking?.customerName?.toLowerCase().includes(keyword);

    const matchesFilter =
      filter === "all" ||
      payment.paymentStatus?.toLowerCase() === filter;

    return matchesSearch && matchesFilter;
  });

  const revenueByCurrency = payments
    .filter((payment) => payment.paymentStatus === "paid")
    .reduce<Record<string, number>>((totals, payment) => {
      const currency = payment.currency?.toUpperCase() || "BDT";

      totals[currency] =
        (totals[currency] || 0) + Number(payment.amount || 0);

      return totals;
    }, {});

  const paidTransactions = payments.filter(
    (payment) => payment.paymentStatus === "paid"
  ).length;

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency?.toUpperCase() || "BDT",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <CreditCard size={25} />
          </div>

          <h1 className="text-3xl font-bold">Manage Transactions</h1>

          <p className="mt-2 text-sm text-violet-100">
            Monitor customer payments and track FixMate revenue.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total Transactions
              </p>
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <Receipt size={22} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {payments.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Successful Payments
              </p>
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CheckCircle size={22} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-green-600">
              {paidTransactions}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total Revenue
              </p>
              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <Wallet size={22} />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              {Object.entries(revenueByCurrency).length > 0 ? (
                Object.entries(revenueByCurrency).map(([currency, amount]) => (
                  <p
                    key={currency}
                    className="text-2xl font-bold text-slate-900"
                  >
                    {formatAmount(amount, currency)}
                  </p>
                ))
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  {formatAmount(0, "USD")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <Search size={20} className="text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by customer, service or transaction ID..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
          >
            <option value="all">All Transactions</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle
              className="animate-spin text-violet-600"
              size={36}
            />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <CreditCard
              className="mx-auto mb-4 text-slate-300"
              size={48}
            />

            <h2 className="text-xl font-bold text-slate-800">
              {payments.length === 0
                ? "No Transactions Found"
                : "No Matching Transactions"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {payments.length === 0
                ? "Customer payment records will appear here after successful payments."
                : "Try another search keyword or filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => {
              const booking = getBooking(payment.bookingId);

              return (
                <article
                  key={payment._id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold capitalize text-green-700">
                          {payment.paymentStatus}
                        </span>

                        <span className="text-xs text-slate-400">
                          {payment.currency?.toUpperCase() || "BDT"}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900">
                        {booking?.serviceTitle || "Repair Service"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Customer:{" "}
                        <span className="font-medium text-slate-700">
                          {booking?.customerName || payment.customerEmail}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Technician:{" "}
                        <span className="font-medium text-slate-700">
                          {booking?.technicianName ||
                            booking?.technicianEmail ||
                            "Not available"}
                        </span>
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-slate-500">
                        Payment Amount
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-violet-700">
                        {formatAmount(payment.amount, payment.currency)}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Transaction ID
                      </p>
                      <p className="mt-1 break-all font-medium text-slate-700">
                        {payment.transactionId || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Booking ID</p>
                      <p className="mt-1 break-all font-medium text-slate-700">
                        {payment.bookingId}
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        Payment Date
                      </p>
                      <p className="mt-1 font-medium text-slate-700">
                        {formatDate(payment.paidAt || payment.createdAt)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}