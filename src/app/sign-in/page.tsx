"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  const googleCallbackHandled = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingGoogleCallback, setCheckingGoogleCallback] = useState(false);

  const getDashboard = (role?: string) => {
    if (role === "technician") {
      return "/dashboard/technician";
    }

    if (role === "admin") {
      return "/dashboard/admin";
    }

    return "/dashboard/customer";
  };

  useEffect(() => {
    if (googleCallbackHandled.current) {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    if (params.get("google") !== "success") {
      return;
    }

    googleCallbackHandled.current = true;

    const handleGoogleCallback = async () => {
      setCheckingGoogleCallback(true);

      try {
        const sessionResult = await authClient.getSession();

        const user = sessionResult.data?.user as
          | { role?: string }
          | undefined;

        if (!user) {
          toast.error("Google sign in failed. Please try again.");
          router.replace("/sign-in");
          return;
        }

        toast.success("Login successful!");

        router.replace(getDashboard(user.role));
        router.refresh();
      } catch {
        toast.error("Unable to complete Google sign in.");
        router.replace("/sign-in");
      }
    };

    handleGoogleCallback();
  }, [router]);

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
        toast.error(result.error.message || "Invalid email or password.");
        return;
      }

      let user = result.data?.user as
        | { role?: string }
        | undefined;

      if (!user?.role) {
        for (let attempt = 0; attempt < 5; attempt++) {
          const sessionResult = await authClient.getSession();

          user = sessionResult.data?.user as
            | { role?: string }
            | undefined;

          if (user?.role) {
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      if (!user) {
        toast.error("Login successful, but session could not be verified.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const callbackURL = params.get("callbackURL");

      let destination = getDashboard(user.role);

      if (
        callbackURL &&
        callbackURL.startsWith("/") &&
        callbackURL.startsWith("//") === false
      ) {
        destination = callbackURL;
      }

      toast.success("Login successful!");

      router.replace(destination);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/sign-in?google=success`,
        errorCallbackURL: `${window.location.origin}/sign-in`,
      });
    } catch {
      toast.error("Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  if (checkingGoogleCallback) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Signing you in...
          </p>
        </div>
      </main>
    );
  }

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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-xl bg-violet-600 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44z"
              />
              <path
                fill="#FBBC05"
                d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3z"
              />
              <path
                fill="#EA4335"
                d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8A19.5 19.5 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3c1.6-4.9 6.1-8.5 11.4-8.5z"
              />
            </svg>

            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

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