"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Edit,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: string;
  isAvailable: boolean;
  createdAt: string;
};

type ServiceForm = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  image: string;
};

const initialForm: ServiceForm = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "Home Visit",
  serviceArea: "Dhaka, Bangladesh",
  image: "",
};

export default function MyServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);

  const getToken = async () => {
    const response = await fetch(`${backendURL}/api/auth/token`, {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
      throw new Error("Authentication token not found. Please sign in again.");
    }

    return data.token as string;
  };

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);

      const session = await authClient.getSession();
      const user = session.data?.user as
        | { role?: string }
        | undefined;

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      if (user.role !== "technician") {
        router.replace("/dashboard/customer");
        return;
      }

      const token = await getToken();

      const response = await fetch(`${backendURL}/api/services/my-services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load services.");
      }

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const openEditModal = (service: Service) => {
    setEditingService(service);

    setForm({
      title: service.title,
      category: service.category,
      description: service.description,
      basePrice: String(service.basePrice),
      estimatedDuration: service.estimatedDuration || "",
      serviceMode: service.serviceMode,
      serviceArea: service.serviceArea,
      image: service.image,
    });
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Number(form.basePrice) <= 0 || Number.isNaN(Number(form.basePrice))) {
      toast.error("Enter a valid service price.");
      return;
    }

    if (!form.image.trim()) {
      toast.error("Service image is required.");
      return;
    }

    if (!editingService) return;

    try {
      setSaving(true);

      const token = await getToken();

      const response = await fetch(
        `${backendURL}/api/services/${editingService._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title.trim(),
            category: form.category,
            description: form.description.trim(),
            basePrice: Number(form.basePrice),
            estimatedDuration: form.estimatedDuration.trim(),
            serviceMode: form.serviceMode,
            serviceArea: form.serviceArea.trim(),
            image: form.image.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Service update failed.");
      }

      toast.success("Service updated successfully. Admin approval is required again.");
      setEditingService(null);
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      setDeletingId(confirmDelete._id);

      const token = await getToken();

      const response = await fetch(
        `${backendURL}/api/services/${confirmDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Service deletion failed.");
      }

      toast.success("Service deleted successfully.");
      setConfirmDelete(null);
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setDeletingId("");
    }
  };

  const filteredServices = services.filter((service) => {
    const keyword = search.toLowerCase();

    return (
      service.title.toLowerCase().includes(keyword) ||
      service.category.toLowerCase().includes(keyword) ||
      service.serviceArea.toLowerCase().includes(keyword)
    );
  });

  const statusStyle = (status: string) => {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/technician"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-lg sm:flex-row sm:items-center">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Wrench size={25} />
            </div>

            <h1 className="text-3xl font-bold">My Services</h1>

            <p className="mt-2 text-sm text-violet-100">
              Manage your repair service listings.
            </p>
          </div>

          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-violet-700 transition hover:bg-violet-50"
          >
            <Plus size={19} />
            Add New Service
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Services</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {services.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Approved</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {services.filter((item) => item.approvalStatus === "approved").length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <h2 className="mt-2 text-2xl font-bold text-amber-600">
              {services.filter((item) => item.approvalStatus === "pending").length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Rejected</p>
            <h2 className="mt-2 text-2xl font-bold text-red-600">
              {services.filter((item) => item.approvalStatus === "rejected").length}
            </h2>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search size={20} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by service title, category or area..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle className="animate-spin text-violet-600" size={35} />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Wrench className="mx-auto mb-4 text-slate-300" size={45} />

            <h2 className="text-xl font-bold text-slate-800">
              {services.length === 0
                ? "No Services Added Yet"
                : "No Matching Services"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {services.length === 0
                ? "Create your first repair service listing."
                : "Try another search keyword."}
            </p>

            {services.length === 0 && (
              <Link
                href="/dashboard/technician/add-service"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
              >
                <Plus size={18} />
                Add New Service
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle(
                      service.approvalStatus
                    )}`}
                  >
                    {service.approvalStatus}
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                      {service.category}
                    </span>

                    <span className="text-xs text-slate-500">
                      {service.serviceMode}
                    </span>
                  </div>

                  <h2 className="line-clamp-1 text-lg font-bold text-slate-900">
                    {service.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Starting Price</span>
                      <span className="font-bold text-violet-700">
                        ${Number(service.basePrice).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-medium text-slate-700">
                        {service.estimatedDuration || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Service Area</span>
                      <span className="text-right font-medium text-slate-700">
                        {service.serviceArea}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openEditModal(service)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => setConfirmDelete(service)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
          <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Service
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Updating your service will require admin approval again.
                </p>
              </div>

              <button
                onClick={() => setEditingService(null)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                required
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Service Title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  required
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                >
                  <option value="">Select Category</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop & PC">Laptop & PC</option>
                  <option value="AC">AC</option>
                  <option value="Refrigerator">Refrigerator</option>
                  <option value="TV">TV</option>
                  <option value="Washing Machine">Washing Machine</option>
                  <option value="Electrical">Electrical</option>
                </select>

                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.basePrice}
                  onChange={(event) =>
                    setForm({ ...form, basePrice: event.target.value })
                  }
                  placeholder="Base Price (USD)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />

                <input
                  required
                  value={form.estimatedDuration}
                  onChange={(event) =>
                    setForm({ ...form, estimatedDuration: event.target.value })
                  }
                  placeholder="Estimated Duration"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />

                <select
                  value={form.serviceMode}
                  onChange={(event) =>
                    setForm({ ...form, serviceMode: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                >
                  <option value="Home Visit">Home Visit</option>
                  <option value="Shop Drop-off">Shop Drop-off</option>
                </select>
              </div>

              <input
                required
                value={form.serviceArea}
                onChange={(event) =>
                  setForm({ ...form, serviceArea: event.target.value })
                }
                placeholder="Service Area"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Service Description"
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <input
                required
                type="url"
                value={form.image}
                onChange={(event) =>
                  setForm({ ...form, image: event.target.value })
                }
                placeholder="Service Image URL"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle className="animate-spin" size={19} />
                ) : (
                  <Edit size={18} />
                )}
                {saving ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={24} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Delete Service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <strong className="text-slate-800">
                {confirmDelete.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deletingId === confirmDelete._id}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId === confirmDelete._id && (
                  <LoaderCircle className="animate-spin" size={17} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}