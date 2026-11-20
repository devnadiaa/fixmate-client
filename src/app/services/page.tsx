"use client";

import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Wrench,
  RefreshCw,
} from "lucide-react";
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

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [serviceMode, setServiceMode] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [retry, setRetry] = useState(0);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setSearch(params.get("search") || "");
    setCategory(params.get("category") || "");
    setServiceMode(params.get("serviceMode") || "");
    setSort(params.get("sort") || "newest");

    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized === false) return;

    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (serviceMode) params.set("serviceMode", serviceMode);
    if (sort !== "newest") params.set("sort", sort);

    const queryString = params.toString();

    const newUrl = queryString
      ? `/services?${queryString}`
      : "/services";

    window.history.replaceState(null, "", newUrl);

    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${apiUrl}/api/services?${queryString}`,
          { signal: controller.signal }
        );

        if (response.ok === false) {
          throw new Error("Services could not be loaded.");
        }

        const data = await response.json();

        setServices(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (controller.signal.aborted === false) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchServices, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [initialized, search, category, serviceMode, sort, apiUrl, retry]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setServiceMode("");
    setSort("newest");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-purple-100">
            <Wrench size={16} />
            Professional Repair Services
          </span>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Find the Right Repair
            <span className="block text-purple-300">
              Service for You
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-purple-100 sm:text-base">
            Explore trusted technicians and professional repair services.
            Get quality solutions for your devices and home appliances.
          </p>
        </div>
      </section>

      <section className="relative mx-auto -mt-6 max-w-7xl px-5 sm:px-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-purple-950/5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              >
                <option value="">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={serviceMode}
                onChange={(e) => setServiceMode(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              >
                <option value="">All Service Modes</option>
                <option value="On-site">On-site</option>
                <option value="At-home">At-home</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="relative">
              <ArrowUpDown
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Find the service that matches your needs.
            </p>

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-800"
            >
              <RefreshCw size={15} />
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
              Explore Our Services
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Available Repair Services
            </h2>
          </div>

          {!loading && (
            <p className="text-sm font-medium text-slate-500">
              {services.length} services found
            </p>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-14 text-center">
            <h3 className="text-xl font-bold text-slate-800">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm text-red-500">{error}</p>

            <button
              onClick={() => setRetry((previous) => previous + 1)}
              className="mt-5 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <Search size={28} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-800">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters to find available services.
            </p>

            <button
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}