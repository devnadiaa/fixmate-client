"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Booking = {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  category?: string;
  technicianName?: string;
  preferredDate: string;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  paidAt?: string;
  createdAt: string;
};

export default function CustomerPaymentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState("");

  const fetchBookings = async () => {
    try {
      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok === false || tokenData.token === undefined) {
        toast.error("Please sign in to view your payments.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendURL}/api/bookings/my`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (response.ok === false) {
        toast.error(data.message || "Failed to load payments.");
        setLoading(false);
        return;
      }

      const completedBookings = data.filter(
        (booking: Booking) => booking.status === "completed"
      );

      setBookings(completedBookings);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayment = async (bookingId: string) => {
    setPayingId(bookingId);

    try {
      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok === false || tokenData.token === undefined) {
        toast.error("Please sign in again.");
        setPayingId("");
        return;
      }

      const response = await fetch(
        `${backendURL}/api/payments/create-checkout-session/${bookingId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok === false) {
        toast.error(data.message || "Unable to start payment.");
        setPayingId("");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Payment session URL not found.");
        setPayingId("");
      }
    } catch {
      toast.error("Payment could not be started.");
      setPayingId("");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownloadInvoice = (booking: Booking) => {
    try {
      const doc = new jsPDF();

      const invoiceNumber = `FM-${booking._id
        .slice(-8)
        .toUpperCase()}`;

      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(109, 40, 217);
      doc.rect(0, 0, pageWidth, 42, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(25);
      doc.text("FixMate", 20, 22);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Professional Home Repair Services", 20, 31);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("INVOICE", pageWidth - 20, 24, {
        align: "right",
      });

      doc.setTextColor(40, 40, 40);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Invoice Information", 20, 58);

      doc.setDrawColor(220, 220, 220);
      doc.line(20, 63, pageWidth - 20, 63);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(`Invoice Number: ${invoiceNumber}`, 20, 74);
      doc.text(`Booking ID: ${booking._id}`, 20, 83);
      doc.text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`, 20, 92);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Service Details", 20, 112);

      doc.line(20, 117, pageWidth - 20, 117);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text("Service Name:", 20, 130);
      doc.text(
        doc.splitTextToSize(booking.serviceTitle, 115),
        65,
        130
      );

      doc.text("Category:", 20, 148);
      doc.text(
        doc.splitTextToSize(booking.category || "Repair Service", 115),
        65,
        148
      );

      doc.text("Technician:", 20, 166);
      doc.text(
        doc.splitTextToSize(
          booking.technicianName || "Not available",
          115
        ),
        65,
        166
      );

      doc.text("Service Date:", 20, 184);
      doc.text(formatDate(booking.preferredDate), 65, 184);

      doc.text("Payment Date:", 20, 202);
      doc.text(
        booking.paidAt
          ? formatDate(booking.paidAt)
          : "Not available",
        65,
        202
      );

      doc.setFillColor(245, 243, 255);
      doc.roundedRect(20, 222, pageWidth - 40, 32, 3, 3, "F");

      doc.setTextColor(70, 50, 120);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Total Paid Amount", 28, 241);

      doc.setTextColor(109, 40, 217);
      doc.setFontSize(17);
      doc.text(
        `$${Number(booking.finalAmount).toFixed(2)}`,
        pageWidth - 28,
        242,
        { align: "right" }
      );

      doc.setTextColor(90, 90, 90);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      doc.text(
        "Thank you for choosing FixMate!",
        pageWidth / 2,
        275,
        { align: "center" }
      );

      doc.text(
        "This invoice confirms the successful payment for the service listed above.",
        pageWidth / 2,
        282,
        { align: "center" }
      );

      doc.save(`FixMate-Invoice-${booking._id}.pdf`);

      toast.success("Invoice downloaded successfully.");
    } catch {
      toast.error("Unable to generate invoice. Please try again.");
    }
  };

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid"
  );

  const unpaidBookings = bookings.filter(
    (booking) => booking.paymentStatus !== "paid"
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 transition-colors dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-slate-100">
            My Payments
          </h1>

          <p className="mt-2 text-gray-600 dark:text-slate-400">
            Manage your completed service payments and payment history.
          </p>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Total Payments
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-slate-100">
              {paidBookings.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Pending Payments
            </p>

            <h2 className="mt-3 text-3xl font-bold text-orange-500">
              {unpaidBookings.length}
            </h2>
          </div>
        </div>

        {unpaidBookings.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-slate-100">
              Pending Payments
            </h2>

            <div className="space-y-4">
              {unpaidBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col gap-5 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {booking.serviceImage ? (
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-purple-100 text-3xl dark:bg-purple-900">
                        🔧
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-slate-100">
                        {booking.serviceTitle}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        Technician: {booking.technicianName || "Not available"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        Completed:{" "}
                        {new Date(booking.preferredDate).toLocaleDateString()}
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                        Payment Pending
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      ${Number(booking.finalAmount).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handlePayment(booking._id)}
                      disabled={payingId === booking._id}
                      className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {payingId === booking._id
                        ? "Redirecting..."
                        : "Pay Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-slate-100">
            Payment History
          </h2>

          {paidBookings.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 text-5xl">💳</div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                No Payment History
              </h3>

              <p className="mt-2 text-gray-500 dark:text-slate-400">
                Your successful payments will appear here.
              </p>

              <Link
                href="/dashboard/customer/bookings"
                className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                View My Bookings
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left">
                  <thead className="bg-gray-50 text-sm text-gray-500 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Service</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Invoice</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {paidBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            {booking.serviceTitle}
                          </p>

                          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                            {booking.category || "Repair Service"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600 dark:text-slate-300">
                          {booking.paidAt
                            ? new Date(booking.paidAt).toLocaleDateString()
                            : new Date(
                                booking.createdAt
                              ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-5 font-semibold text-gray-900 dark:text-slate-100">
                          ${Number(booking.finalAmount).toFixed(2)}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                            Paid
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <button
                            onClick={() => handleDownloadInvoice(booking)}
                            className="whitespace-nowrap rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                          >
                            Download Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}