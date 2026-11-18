"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Wrench,
  ShieldCheck,
  Clock,
} from "lucide-react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${apiUrl}/api/services/${id}`);

        if (response.ok === false) {
          throw new Error("Service details could not be loaded.");
        }

        const data = await response.json();
        setService(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Service Not Found
        </h2>
        <p className="mt-2 text-slate-500">
          {error || "This service is not available."}
        </p>
        <Link
          href="/services"
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-violet-600 hover:text-violet-800"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg lg:grid-cols-2">
          <div className="relative min-h-[300px] bg-slate-100 lg:min-h-[550px]">
            <img
              src={service.image || "/placeholder-service.jpg"}
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-violet-700 shadow">
              {service.category}
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <span className="text-sm font-bold uppercase tracking-wider text-violet-600">
              Professional Repair Service
            </span>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {service.title}
            </h1>

            <p className="mt-5 leading-7 text-slate-600">
              {service.description}
            </p>

            <div className="mt-8 space-y-5 border-y border-slate-100 py-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <Wrench size={21} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Technician</p>
                  <p className="font-semibold text-slate-800">
                    {service.technicianName || "Professional Technician"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <MapPin size={21} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Service Area</p>
                  <p className="font-semibold text-slate-800">
                    {service.serviceArea || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <Clock size={21} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Service Mode</p>
                  <p className="font-semibold text-slate-800">
                    {service.serviceMode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Service Quality</p>
                  <p className="font-semibold text-slate-800">
                    Trusted Professional Service
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Starting Price</p>
                <p className="text-3xl font-extrabold text-violet-700">
                  ৳{service.basePrice}
                </p>
              </div>

              <Link
                href="/sign-in"
                className="rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                Book Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}