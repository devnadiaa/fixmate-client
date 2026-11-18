"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Wrench,
  ShieldCheck,
  CalendarDays,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

type Technician = {
  name: string;
  email: string;
  image?: string;
  area?: string;
  bio?: string;
};

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration?: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  technician: Technician;
};

function ServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  const today = new Date();

  const minimumDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${backendURL}/api/services/${id}`
        );

        if (response.ok === false) {
          throw new Error("Service not found");
        }

        const data = await response.json();
        setService(data);
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, backendURL]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authClient.getSession();

        if (data?.user) {
          setRole((data.user as typeof data.user & { role?: string }).role || "");
          setUserName(data.user.name || "");
          setUserEmail(data.user.email || "");
        }
      } catch {
        setRole("");
      }
    };

    fetchUser();
  }, []);

  const handleBooking = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (formData.phone.trim() === "") {
      toast.error("Please enter your phone number");
      return;
    }

    if (formData.address.trim() === "") {
      toast.error("Please enter your address");
      return;
    }

    if (formData.preferredDate < minimumDate) {
      toast.error("Please select today or a future date");
      return;
    }

    if (formData.problemDescription.trim().length < 20) {
      toast.error("Problem description must be at least 20 characters");
      return;
    }

    try {
      setSubmitting(true);

      const tokenResponse = await fetch(
        `${backendURL}/api/auth/token`,
        {
          credentials: "include",
        }
      );

      if (tokenResponse.ok === false) {
        toast.error("Please sign in again");

        router.push(
          `/sign-in?callbackURL=${encodeURIComponent(
            `/services/${id}`
          )}`
        );

        return;
      }

      const tokenData = await tokenResponse.json();

      const response = await fetch(`${backendURL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          serviceId: service?._id,
          phone: formData.phone,
          address: formData.address,
          preferredDate: formData.preferredDate,
          problemDescription: formData.problemDescription,
        }),
      });

      const data = await response.json();

      if (response.ok === false) {
        toast.error(data.message || "Booking request failed");
        return;
      }

      toast.success("Repair request submitted successfully");

      setFormData({
        phone: "",
        address: "",
        preferredDate: "",
        problemDescription: "",
      });

      setShowForm(false);

      router.push("/dashboard/customer/bookings");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
      </div>
    );
  }

  if (service === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Wrench className="mb-4 h-16 w-16 text-gray-300" />

        <h2 className="text-2xl font-bold text-gray-800">
          Service Not Found
        </h2>

        <p className="mt-2 text-gray-500">
          This service is unavailable or does not exist.
        </p>

        <Link
          href="/services"
          className="mt-6 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 font-medium text-violet-600 hover:text-violet-800"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative h-72 w-full bg-violet-100 md:h-[420px]">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Wrench className="h-16 w-16 text-violet-400" />
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <span className="rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
                  {service.category}
                </span>

                <h1 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
                  {service.title}
                </h1>

                <p className="mt-5 leading-8 text-gray-600">
                  {service.description}
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 text-violet-600" />

                    <div>
                      <p className="font-semibold text-gray-800">
                        Service Area
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {service.serviceArea || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wrench className="mt-1 text-violet-600" />

                    <div>
                      <p className="font-semibold text-gray-800">
                        Service Mode
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {service.serviceMode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 text-violet-600" />

                    <div>
                      <p className="font-semibold text-gray-800">
                        Estimated Duration
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {service.estimatedDuration || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 text-violet-600" />

                    <div>
                      <p className="font-semibold text-gray-800">
                        Service Status
                      </p>

                      <p className="mt-1 text-sm text-green-600">
                        Approved & Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                About the Technician
              </h2>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100">
                  {service.technician?.image ? (
                    <Image
                      src={service.technician.image}
                      alt={service.technician.name}
                      width={80}
                      height={80}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-violet-600" />
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {service.technician?.name ||
                      service.technicianName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {service.technician?.area ||
                      service.serviceArea ||
                      "Area not specified"}
                  </p>

                  <p className="mt-3 leading-7 text-gray-600">
                    {service.technician?.bio ||
                      "Technician profile information is not available."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Starting Price
            </p>

            <p className="mt-2 text-4xl font-bold text-violet-700">
              ${service.basePrice}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Final cost may vary depending on the repair.
            </p>

            <div className="my-6 border-t border-gray-100"></div>

            {role === "customer" ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full rounded-xl bg-violet-600 px-5 py-3.5 font-semibold text-white transition hover:bg-violet-700"
              >
                {showForm ? "Close Booking Form" : "Request Repair"}
              </button>
            ) : role === "technician" || role === "admin" ? (
              <div className="rounded-xl bg-amber-50 p-4 text-center text-sm font-medium text-amber-700">
                Only customers can request a repair.
              </div>
            ) : (
              <Link
                href={`/sign-in?callbackURL=${encodeURIComponent(
                  `/services/${id}`
                )}`}
                className="block w-full rounded-xl bg-violet-600 px-5 py-3.5 text-center font-semibold text-white transition hover:bg-violet-700"
              >
                Sign In to Request Repair
              </Link>
            )}

            {showForm && role === "customer" && (
              <form onSubmit={handleBooking} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    value={userName}
                    readOnly
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={userEmail}
                    readOnly
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        phone: event.target.value,
                      })
                    }
                    placeholder="Enter your phone number"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Address
                  </label>

                  <textarea
                    value={formData.address}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        address: event.target.value,
                      })
                    }
                    placeholder="Enter your full address"
                    rows={3}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Preferred Date
                  </label>

                  <input
                    type="date"
                    min={minimumDate}
                    value={formData.preferredDate}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        preferredDate: event.target.value,
                      })
                    }
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Problem Description
                  </label>

                  <textarea
                    value={formData.problemDescription}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        problemDescription: event.target.value,
                      })
                    }
                    placeholder="Describe the problem in at least 20 characters"
                    rows={4}
                    minLength={20}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Minimum 20 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CalendarDays size={18} />

                  {submitting
                    ? "Submitting..."
                    : "Submit Repair Request"}
                </button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
        </div>
      }
    >
      <ServiceDetailsContent />
    </Suspense>
  );
}