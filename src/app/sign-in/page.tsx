"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { LockKeyhole, Mail } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Invalid email or password."
        );
        return;
      }

      const sessionResult = await authClient.getSession();

      const user = sessionResult.data?.user as
        | { role?: string }
        | undefined;

      const params = new URLSearchParams(window.location.search);
      const callbackURL = params.get("callbackURL");

      let destination = "/dashboard/customer";

      if (user?.role === "technician") {
        destination = "/dashboard/technician";
      }

      if (user?.role === "admin") {
        destination = "/dashboard/admin";
      }

      if (
        callbackURL &&
        callbackURL.startsWith("/") &&
        callbackURL.startsWith("//") === false
      ) {
        destination = callbackURL;
      }

      toast.success("Login successful!");

      setTimeout(() => {
        router.replace(destination);
        router.refresh();
      }, 1000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden flex-col justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-12 text-white lg:flex">
          <h1 className="text-4xl font-extrabold leading-tight">
            Welcome Back to
            <span className="mt-2 block text-purple-300">FixMate</span>
          </h1>

          <p className="mt-5 leading-8 text-purple-100">
            Your trusted repair service platform. Sign in to manage your
            bookings and connect with professional technicians.
          </p>
        </div>

        <div className="p-7 sm:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Sign In
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your account details to continue.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-violet-600 hover:text-violet-800"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}