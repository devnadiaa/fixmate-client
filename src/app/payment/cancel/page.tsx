import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl text-red-600">
          !
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment was cancelled. No payment has been made.
        </p>

        <Link
          href="/dashboard/customer/payments"
          className="mt-8 inline-block rounded-xl bg-purple-600 px-7 py-3 font-semibold text-white transition hover:bg-purple-700"
        >
          Back to Payments
        </Link>
      </div>
    </div>
  );
}