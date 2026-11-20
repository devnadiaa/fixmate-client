"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
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
  Star,
  CheckCircle2,
  Home,
  Store,
  Image as ImageIcon,
  Phone,
  Mail,
  ClipboardList,
  Send,
  X,
  FileText,
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

type Review = {
  _id: string;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
};

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  galleryImages?: string[];
  basePrice: number;
  estimatedDuration?: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  technician?: Technician;
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
};

export default function ServiceDetailsPage() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [minimumDate, setMinimumDate] = useState("");

  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  useEffect(() => {
    const segments = window.location.pathname.split("/");
    setId(segments[segments.length - 1] || "");

    const today = new Date();

    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    setMinimumDate(formattedDate);
  }, []);

  useEffect(() => {
    if (id === "") return;

    const fetchService = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${backendURL}/api/services/${id}`);

        if (response.ok === false) {
          throw new Error("Service not found");
        }

        const data = await response.json();

        setService(data);
        setSelectedImage(data.image || "");
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, backendURL]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authClient.getSession();

        if (data?.user) {
          setRole(
            (data.user as typeof data.user & { role?: string }).role || ""
          );
          setUserName(data.user.name || "");
          setUserEmail(data.user.email || "");
        }
      } catch {
        setRole("");
      }
    };

    fetchUser();
  }, []);

  const galleryImages = service
    ? Array.from(
        new Set(
          [service.image, ...(service.galleryImages || [])].filter(
            (image): image is string =>
              typeof image === "string" && image.trim() !== ""
          )
        )
      )
    : [];

  const reviews = service?.reviews || [];
  const averageRating = service?.averageRating || 0;
  const reviewCount = service?.reviewCount || reviews.length;

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
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

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      if (tokenResponse.ok === false) {
        toast.error("Please sign in again");

        router.push(
          `/sign-in?callbackURL=${encodeURIComponent(`/services/${id}`)}`
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

  const openBookingForm = () => {
    setShowForm(true);

    setTimeout(() => {
      document.getElementById("booking-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
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
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/services"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-3">
          <main className="space-y-8 lg:col-span-2">
            <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="relative h-72 bg-slate-100 sm:h-[420px]">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={service.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}

                <div className="absolute left-5 top-5">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-violet-700 shadow-sm">
                    {service.category}
                  </span>
                </div>

                <div className="absolute bottom-5 right-5">
                  <span className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm">
                    <CheckCircle2 size={15} />
                    Approved & Available
                  </span>
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto border-b border-gray-100 p-4">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        selectedImage === image
                          ? "border-violet-600"
                          : "border-transparent hover:border-violet-300"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${service.title} image ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
                    {service.category}
                  </span>

                  {reviewCount > 0 && (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                      <Star
                        size={17}
                        className="fill-amber-400 text-amber-400"
                      />
                      {averageRating.toFixed(1)}
                      <span className="font-normal text-gray-400">
                        ({reviewCount} reviews)
                      </span>
                    </span>
                  )}
                </div>

                <h1 className="mt-5 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                  {service.title}
                </h1>

                <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-600">
                  {service.description}
                </p>

                <div className="my-8 border-t border-gray-100" />

                <h2 className="text-xl font-bold text-gray-900">
                  Service Information
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <MapPin size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Service Area
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {service.serviceArea || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      {service.serviceMode === "Home Visit" ? (
                        <Home size={21} />
                      ) : (
                        <Store size={21} />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Service Mode
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {service.serviceMode || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <Clock size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Estimated Duration
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {service.estimatedDuration || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <ShieldCheck size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Service Status
                      </p>
                      <p className="mt-1 text-sm font-medium text-emerald-600">
                        Verified & Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <User size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    About the Technician
                  </h2>
                  <p className="text-sm text-gray-500">
                    Meet your service professional
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-5 sm:flex-row">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-violet-100">
                  {service.technician?.image ? (
                    <Image
                      src={service.technician.image}
                      alt={service.technician.name || service.technicianName}
                      width={96}
                      height={96}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-violet-600" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.technician?.name || service.technicianName}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={15} className="text-violet-600" />
                    {service.technician?.area ||
                      service.serviceArea ||
                      "Area not specified"}
                  </p>

                  <p className="mt-4 leading-7 text-gray-600">
                    {service.technician?.bio ||
                      "Technician profile information is not available."}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Ratings & Reviews
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Feedback from customers
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-gray-900">
                    <Star
                      size={22}
                      className="fill-amber-400 text-amber-400"
                    />
                    {reviewCount > 0 ? averageRating.toFixed(1) : "—"}
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {reviewCount} Reviews
                  </p>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="mt-7 space-y-5">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-2xl border border-gray-100 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {review.customerName}
                        </h3>

                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mt-2 flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={16}
                            className={
                              index < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      <p className="mt-3 text-sm leading-7 text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-7 rounded-2xl bg-slate-50 px-5 py-10 text-center">
                  <Star className="mx-auto h-10 w-10 text-amber-400" />

                  <h3 className="mt-3 font-semibold text-gray-800">
                    No reviews yet
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Customer ratings and reviews will appear here after
                    completed and paid bookings.
                  </p>
                </div>
              )}
            </section>
          </main>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-sm font-semibold text-gray-500">
                Starting Price
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-violet-700">
                  ${service.basePrice}
                </span>
                <span className="text-sm text-gray-400">/ service</span>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Final cost may vary depending on the repair and required
                parts.
              </p>

              <div className="my-6 border-t border-gray-100" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Availability</span>
                  <span className="font-semibold text-emerald-600">
                    Available
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Service Mode</span>
                  <span className="font-semibold text-gray-800">
                    {service.serviceMode}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold text-gray-800">
                    {service.estimatedDuration || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-gray-100" />

              {role === "customer" ? (
                <button
                  type="button"
                  onClick={openBookingForm}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
                >
                  <CalendarDays size={19} />
                  Request Repair
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
                  className="block w-full rounded-xl bg-violet-600 px-5 py-4 text-center font-bold text-white transition hover:bg-violet-700"
                >
                  Sign In to Request Repair
                </Link>
              )}

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-violet-50 p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-violet-600"
                />

                <p className="text-xs leading-6 text-violet-800">
                  Your booking request will be sent directly to the assigned
                  technician for confirmation.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {showForm && role === "customer" && (
          <section
            id="booking-form"
            className="mt-10 scroll-mt-8 overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-lg shadow-violet-100/50"
          >
            <div className="bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 px-6 py-8 text-white sm:px-10 sm:py-10">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <ClipboardList size={25} />
                  </div>

                  <h2 className="text-2xl font-extrabold sm:text-3xl">
                    Book Your Repair Service
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100">
                    Complete the form below with your contact information and
                    repair details. Our technician will review your request.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full bg-white/15 transition hover:bg-white/25 sm:self-start"
                  aria-label="Close booking form"
                >
                  <X size={21} />
                </button>
              </div>
            </div>

            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <form onSubmit={handleBooking} className="space-y-8">
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <User size={20} />
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">
                          Customer Information
                        </h3>
                        <p className="text-xs text-gray-500">
                          Your registered account information
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Full Name
                        </label>

                        <div className="relative">
                          <User
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />

                          <input
                            type="text"
                            value={userName}
                            readOnly
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-gray-600 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Email Address
                        </label>

                        <div className="relative">
                          <Mail
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />

                          <input
                            type="email"
                            value={userEmail}
                            readOnly
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-gray-600 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <Wrench size={20} />
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">
                          Repair Information
                        </h3>
                        <p className="text-xs text-gray-500">
                          Tell us how we can help you
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Phone Number
                        </label>

                        <div className="relative">
                          <Phone
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />

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
                            className="w-full rounded-xl border border-gray-200 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Service Address
                        </label>

                        <div className="relative">
                          <MapPin
                            size={17}
                            className="absolute left-4 top-4 text-gray-400"
                          />

                          <textarea
                            value={formData.address}
                            onChange={(event) =>
                              setFormData({
                                ...formData,
                                address: event.target.value,
                              })
                            }
                            placeholder="Enter your full address, area and city"
                            rows={3}
                            required
                            className="w-full resize-none rounded-xl border border-gray-200 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Preferred Service Date
                        </label>

                        <div className="relative">
                          <CalendarDays
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />

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
                            className="w-full rounded-xl border border-gray-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Describe Your Problem
                        </label>

                        <div className="relative">
                          <FileText
                            size={17}
                            className="absolute left-4 top-4 text-gray-400"
                          />

                          <textarea
                            value={formData.problemDescription}
                            onChange={(event) =>
                              setFormData({
                                ...formData,
                                problemDescription: event.target.value,
                              })
                            }
                            placeholder="Describe your device or appliance problem, symptoms and any other important details..."
                            rows={5}
                            minLength={20}
                            required
                            className="w-full resize-none rounded-xl border border-gray-200 py-3.5 pl-11 pr-4 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                          />
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                          Minimum 20 characters.{" "}
                          {formData.problemDescription.length} characters
                          entered.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                      className="rounded-xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={17} />

                      {submitting
                        ? "Submitting Request..."
                        : "Submit Repair Request"}
                    </button>
                  </div>
                </form>
              </div>

              <aside className="h-fit rounded-2xl border border-gray-100 bg-slate-50 p-5 lg:sticky lg:top-24">
                <h3 className="font-bold text-gray-900">
                  Booking Summary
                </h3>

                <div className="mt-5 flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-violet-600">
                      {service.category}
                    </p>

                    <h4 className="mt-1 font-bold leading-5 text-gray-900">
                      {service.title}
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      By {service.technician?.name || service.technicianName}
                    </p>
                  </div>
                </div>

                <div className="my-5 border-t border-gray-200" />

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Starting Price</span>
                    <span className="font-bold text-gray-900">
                      ${service.basePrice}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Service Mode</span>
                    <span className="font-semibold text-gray-800">
                      {service.serviceMode}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Estimated Time</span>
                    <span className="font-semibold text-gray-800">
                      {service.estimatedDuration || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="my-5 border-t border-gray-200" />

                <div className="rounded-xl bg-violet-100 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-violet-700"
                    />

                    <p className="text-xs leading-6 text-violet-900">
                      Your request will be reviewed by the technician.
                      Final repair costs may vary depending on the problem
                      and required parts.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}