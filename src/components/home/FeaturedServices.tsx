"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

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
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
                className="h-80 animate-pulse rounded-2xl bg-slate-200"
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
              <div
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No Image Available
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
                    {service.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Service Mode</span>
                      <span className="font-medium text-slate-700">
                        {service.serviceMode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} />
                      <span>{service.serviceArea || "Service Area Available"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Starting from</p>
                        <p className="text-xl font-bold text-blue-600">
                          ${service.basePrice}
                        </p>
                      </div>

                      <Link
                        href={`/services/${service._id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        Details
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />
                    Technician: {service.technicianName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}