"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your payment...");
  const verified = useRef(false);

  useEffect(() => {
    if (verified.current) {
      return;
    }

    verified.current = true;

    const verifyPayment = async () => {
      try {
        const sessionId = new URLSearchParams(
          window.location.search
        ).get("session_id");

        if (sessionId === null) {
          setMessage("Payment session not found.");
          setLoading(false);
          return;
        }

        const tokenResponse = await fetch(
          `${backendURL}/api/auth/token`,
          {
            credentials: "include",
          }
        );

        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok === false || tokenData.token === undefined) {
          setMessage("Please sign in again to verify your payment.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${backendURL}/api/payments/verify-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenData.token}`,
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const data = await response.json();

        if (response.ok === false) {
          setMessage(data.message || "Payment verification failed.");
          setLoading(false);
          return;
        }

        setSuccess(true);
        setMessage("Your payment has been successfully verified.");
        toast.success("Payment successful!");
      } catch {
        setMessage("Something went wrong while verifying your payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg sm:p-12">
        {loading ? (
          <>
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>

            <h1 className="text-2xl font-bold text-gray-900">
              Verifying Payment
            </h1>

            <p className="mt-3 text-gray-500">{message}</p>
          </>
        ) : success ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Payment Successful!
            </h1>

            <p className="mt-3 text-gray-600">{message}</p>

            <Link
              href="/dashboard/customer/payments"
              className="mt-8 inline-block rounded-xl bg-purple-600 px-7 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              View Payment History
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl text-red-600">
              !
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Payment Verification Failed
            </h1>

            <p className="mt-3 text-gray-600">{message}</p>

            <Link
              href="/dashboard/customer/payments"
              className="mt-8 inline-block rounded-xl bg-purple-600 px-7 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Back to Payments
            </Link>
          </>
        )}
      </div>
    </div>
  );
}