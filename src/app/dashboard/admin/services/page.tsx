"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  CheckCircle,
  Clock,
  XCircle,
  Search,
  ShieldCheck,
  LoaderCircle,
  ImageIcon,
} from "lucide-react";

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
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: string;
};

type Action = {
  id: string;
  status: "approved" | "rejected";
  title: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [action, setAction] = useState<Action | null>(null);

  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const session = await authClient.getSession();
      const user = session.data?.user as
        | { role?: string }
        | undefined;

      if (user?.role !== "admin") {
        toast.error("Admin access required.");
        setLoading(false);
        return;
      }

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok === false || tokenData.token === undefined) {
        toast.error("Authentication failed.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendURL}/api/admin/services`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok === false) {
        throw new Error(data.message || "Failed to load services.");
      }

      setServices(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateApproval = async () => {
    if (action === null) {
      return;
    }

    setUpdating(true);

    try {
      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok === false || tokenData.token === undefined) {
        throw new Error("Authentication failed.");
      }

      const response = await fetch(
        `${backendURL}/api/admin/services/${action.id}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            approvalStatus: action.status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok === false) {
        throw new Error(data.message || "Failed to update service.");
      }

      setServices((previous) =>
        previous.map((service) =>
          service._id === action.id
            ? { ...service, approvalStatus: action.status }
            : service
        )
      );

      toast.success(
        action.status === "approved"
          ? "Service approved successfully!"
          : "Service rejected successfully!"
      );

      setAction(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesFilter =
      filter === "all" || service.approvalStatus === filter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      service.title.toLowerCase().includes(searchText) ||
      service.category.toLowerCase().includes(searchText) ||
      service.technicianName?.toLowerCase().includes(searchText) ||
      service.technicianEmail?.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const pendingCount = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;

  const approvedCount = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const rejectedCount = services.filter(
    (service) => service.approvalStatus === "rejected"
  ).length;

  const getStatusStyle = (status: string) => {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-violet-600">
              <ShieldCheck size={22} />
              <span className="text-sm font-bold uppercase tracking-wider">
                Administration
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900">
              Manage Services
            </h1>

            <p className="mt-2 text-slate-500">
              Review technician listings and manage service approvals.
            </p>
          </div>

          <div className="rounded-xl border border-violet-100 bg-white px-5 py-3 shadow-sm">
            <p className="text-sm text-slate-500">Total Services</p>
            <p className="text-2xl font-extrabold text-violet-600">
              {services.length}
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending</p>
                <h2 className="mt-2 text-3xl font-extrabold text-amber-600">
                  {pendingCount}
                </h2>
              </div>
              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Approved</p>
                <h2 className="mt-2 text-3xl font-extrabold text-green-600">
                  {approvedCount}
                </h2>
              </div>
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Rejected</p>
                <h2 className="mt-2 text-3xl font-extrabold text-red-600">
                  {rejectedCount}
                </h2>
              </div>
              <div className="rounded-xl bg-red-100 p-3 text-red-600">
                <XCircle size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services or technicians..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                    filter === status
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle className="animate-spin text-violet-600" size={36} />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-500">
              <ImageIcon size={30} />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No services match your current search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 bg-slate-100">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <ImageIcon size={40} />
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                      service.approvalStatus
                    )}`}
                  >
                    {service.approvalStatus}
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                      {service.category}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {service.serviceMode}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {service.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="my-4 space-y-2 border-y border-slate-100 py-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Technician</span>
                      <span className="text-right font-semibold text-slate-800">
                        {service.technicianName || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Email</span>
                      <span className="break-all text-right font-medium text-slate-700">
                        {service.technicianEmail || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Service Area</span>
                      <span className="text-right font-medium text-slate-700">
                        {service.serviceArea || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Duration</span>
                      <span className="text-right font-medium text-slate-700">
                        {service.estimatedDuration || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Starting Price
                    </span>
                    <span className="text-xl font-extrabold text-violet-700">
                      ${Number(service.basePrice).toFixed(2)}
                    </span>
                  </div>

                  {service.approvalStatus === "pending" ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          setAction({
                            id: service._id,
                            status: "approved",
                            title: service.title,
                          })
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                      >
                        <CheckCircle size={17} />
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          setAction({
                            id: service._id,
                            status: "rejected",
                            title: service.title,
                          })
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-500">
                      {service.approvalStatus === "approved"
                        ? "Service is approved"
                        : "Service is rejected"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                action.status === "approved"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {action.status === "approved" ? (
                <CheckCircle size={28} />
              ) : (
                <XCircle size={28} />
              )}
            </div>

            <h2 className="text-center text-xl font-extrabold text-slate-900">
              Confirm {action.status === "approved" ? "Approval" : "Rejection"}
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to{" "}
              {action.status === "approved" ? "approve" : "reject"}{" "}
              <span className="font-bold text-slate-800">
                {action.title}
              </span>
              ?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setAction(null)}
                disabled={updating}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={updateApproval}
                disabled={updating}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:opacity-60 ${
                  action.status === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updating && <LoaderCircle size={16} className="animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}