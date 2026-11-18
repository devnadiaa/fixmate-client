"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { User, Mail, LockKeyhole, UserRound, Wrench } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [loading, setLoading] = useState(false);

  const passwordErrors = [];

  if (password.length < 6) {
    passwordErrors.push("Password must be at least 6 characters.");
  }

  if (!/[A-Z]/.test(password)) {
    passwordErrors.push("At least one uppercase letter is required.");
  }

  if (!/[a-z]/.test(password)) {
    passwordErrors.push("At least one lowercase letter is required.");
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (passwordErrors.length > 0) {
      toast.error("Please meet all password requirements.");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Account creation failed."
        );
        return;
      }

      toast.success("Account created successfully!");

      setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
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
            Join the
            <span className="mt-2 block text-purple-300">
              FixMate Community
            </span>
          </h1>

          <p className="mt-5 leading-8 text-purple-100">
            Create your account and connect with trusted repair professionals.
            Get reliable solutions for your devices and home appliances.
          </p>
        </div>

        <div className="p-7 sm:p-10">
          <div className="mb-7">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fill in your details to get started with FixMate.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {password && passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((error) => (
                    <p key={error} className="text-xs text-red-500">
                      • {error}
                    </p>
                  ))}
                </div>
              )}

              {password && passwordErrors.length === 0 && (
                <p className="mt-2 text-xs font-medium text-green-600">
                  Password requirements satisfied.
                </p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Select Your Role
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    role === "customer"
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                  }`}
                >
                  <UserRound size={22} />

                  <span>
                    <span className="block text-sm font-bold">Customer</span>
                    <span className="mt-1 block text-xs">Book services</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("technician")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    role === "technician"
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                  }`}
                >
                  <Wrench size={22} />

                  <span>
                    <span className="block text-sm font-bold">Technician</span>
                    <span className="mt-1 block text-xs">Provide services</span>
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || passwordErrors.length > 0}
              className="w-full rounded-xl bg-violet-600 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-violet-600 hover:text-violet-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}