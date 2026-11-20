"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  Edit,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
  Wrench,
  X,
  ImagePlus,
} from "lucide-react";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  galleryImages?: string[];
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
};

type ServiceImage = {
  id: string;
  file?: File;
  url: string;
  preview: string;
};

const initialForm: ServiceForm = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "Home Visit",
  serviceArea: "Dhaka, Bangladesh",
};

export default function MyServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(initialForm);
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [imageURL, setImageURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);
  const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState("");

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
      const user = session.data?.user as { role?: string } | undefined;

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

  const clearImagePreviews = () => {
    images.forEach((image) => {
      if (image.file) {
        URL.revokeObjectURL(image.preview);
      }
    });
  };

  const closeEditModal = () => {
    clearImagePreviews();
    setEditingService(null);
    setForm(initialForm);
    setImages([]);
    setImageURL("");
  };

  const openEditModal = (service: Service) => {
    const galleryImages = service.galleryImages || [];

    const existingImages =
      galleryImages.length > 0 ? galleryImages : [service.image];

    setEditingService(service);

    setForm({
      title: service.title,
      category: service.category,
      description: service.description,
      basePrice: String(service.basePrice),
      estimatedDuration: service.estimatedDuration || "",
      serviceMode: service.serviceMode,
      serviceArea: service.serviceArea,
    });

    setImages(
      existingImages.filter(Boolean).slice(0, 5).map((url, index) => ({
        id: `${service._id}-${index}`,
        url,
        preview: url,
      }))
    );

    setImageURL("");
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (images.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image.`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB limit.`);
        return false;
      }

      return true;
    });

    const newImages = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      url: "",
      preview: URL.createObjectURL(file),
    }));

    setImages((previous) => [...previous, ...newImages]);
    event.target.value = "";
  };

  const handleAddImageURL = () => {
    const url = imageURL.trim();

    if (!url) {
      toast.error("Please enter an image URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }

    if (images.length >= 5) {
      toast.error("You can add a maximum of 5 images.");
      return;
    }

    setImages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        url,
        preview: url,
      },
    ]);

    setImageURL("");
  };

  const handleRemoveImage = (id: string) => {
    setImages((previous) => {
      const selectedImage = previous.find((image) => image.id === id);

      if (selectedImage?.file) {
        URL.revokeObjectURL(selectedImage.preview);
      }

      return previous.filter((image) => image.id !== id);
    });
  };

  const uploadImage = async (file: File) => {
    if (!imgbbApiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error("Image upload failed. Please try again.");
    }

    return data.data.url as string;
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      Number(form.basePrice) <= 0 ||
      Number.isNaN(Number(form.basePrice))
    ) {
      toast.error("Enter a valid service price.");
      return;
    }

    if (images.length === 0) {
      toast.error("Please add at least one service image.");
      return;
    }

    if (images.length > 5) {
      toast.error("You can add a maximum of 5 images.");
      return;
    }

    if (!editingService) return;

    try {
      setSaving(true);

      const token = await getToken();
      const uploadedImages: string[] = [];

      for (const image of images) {
        if (image.file) {
          const uploadedURL = await uploadImage(image.file);
          uploadedImages.push(uploadedURL);
        } else {
          uploadedImages.push(image.url);
        }
      }

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
            image: uploadedImages[0],
            images: uploadedImages,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Service update failed.");
      }

      toast.success(
        "Service updated successfully. Admin approval is required again."
      );

      clearImagePreviews();
      setEditingService(null);
      setForm(initialForm);
      setImages([]);
      setImageURL("");

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

  const handleAvailabilityToggle = async (service: Service) => {
    if (service.approvalStatus !== "approved") return;

    try {
      setUpdatingAvailabilityId(service._id);

      const token = await getToken();
      const nextAvailability = !service.isAvailable;

      const response = await fetch(
        `${backendURL}/api/services/${service._id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isAvailable: nextAvailability,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Availability update failed.");
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? { ...item, isAvailable: nextAvailability }
            : item
        )
      );

      toast.success(
        nextAvailability
          ? "Service is now available."
          : "Service is now unavailable."
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdatingAvailabilityId("");
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

                  {service.approvalStatus === "approved" && (
                    <button
                      onClick={() => handleAvailabilityToggle(service)}
                      disabled={updatingAvailabilityId === service._id}
                      className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                        service.isAvailable
                          ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                          : "border-green-200 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {updatingAvailabilityId === service._id ? (
                        <>
                          <LoaderCircle className="animate-spin" size={17} />
                          Updating...
                        </>
                      ) : service.isAvailable ? (
                        "Available — Make Unavailable"
                      ) : (
                        "Unavailable — Make Available"
                      )}
                    </button>
                  )}

                  <div className="mt-3 grid grid-cols-2 gap-3">
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4">
          <div className="mx-auto my-4 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
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
                type="button"
                onClick={closeEditModal}
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

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Service Gallery
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Add up to 5 images. First image will be the main image.
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                    {images.length}/5
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative overflow-hidden rounded-xl border border-slate-200"
                    >
                      <img
                        src={image.preview}
                        alt={`Service image ${index + 1}`}
                        className="h-28 w-full object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-violet-600/90 py-1 text-center text-xs font-semibold text-white">
                          Main Image
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow hover:bg-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {images.length < 5 && (
                  <>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50 px-4 py-6 text-center transition hover:bg-violet-100">
                      <ImagePlus size={27} className="mb-2 text-violet-600" />
                      <span className="text-sm font-bold text-violet-700">
                        Upload Images
                      </span>
                      <span className="mt-1 text-xs text-slate-500">
                        JPG, PNG or WEBP · Maximum 5MB each
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <input
                        type="url"
                        value={imageURL}
                        onChange={(event) => setImageURL(event.target.value)}
                        placeholder="Or paste an image URL"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500"
                      />

                      <button
                        type="button"
                        onClick={handleAddImageURL}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-100 px-5 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-200"
                      >
                        <Plus size={17} />
                        Add URL
                      </button>
                    </div>
                  </>
                )}
              </div>

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