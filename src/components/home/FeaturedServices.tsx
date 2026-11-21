"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";

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

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const response = await fetch(`${apiUrl}/api/services`);

        if (response.ok === false) {
          throw new Error("Failed to load services");
        }

        const data = await response.json();

        setServices(data.slice(0, 6));
      } catch {
        setError("Unable to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              Our Services
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured Repair Services
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              Explore our latest repair services from trusted and approved
              technicians.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:gap-3"
          >
            View All Services
            <ArrowRight size={19} />
          </Link>
        </div>

        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {loading === false && error === "" && services.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-slate-800">
              No Services Available Yet
            </h3>

            <p className="mt-2 text-slate-500">
              Approved repair services will appear here.
            </p>
          </div>
        )}

        {loading === false && error === "" && services.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}