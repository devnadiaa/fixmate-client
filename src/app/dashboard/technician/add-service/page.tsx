"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  ImagePlus,
  LoaderCircle,
  Upload,
  Wrench,
  UserRound,
  Tag,
  DollarSign,
  Clock3,
  MapPin,
  FileText,
  Images,
  Trash2,
  Plus,
  CheckCircle2,
  X,
} from "lucide-react";
import Link from "next/link";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Technician = {
  name: string;
  email: string;
  role: string;
};

type ServiceImage = {
  id: string;
  file?: File;
  url: string;
  preview: string;
};

export default function AddServicePage() {
  const router = useRouter();

  const [technician, setTechnician] = useState<Technician>({
    name: "",
    email: "",
    role: "",
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [serviceMode, setServiceMode] = useState("Home Visit");
  const [serviceArea, setServiceArea] = useState("");

  const [images, setImages] = useState<ServiceImage[]>([]);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadTechnician = async () => {
      try {
        const result = await authClient.getSession();

        const user = result.data?.user as
          | {
              name?: string;
              email?: string;
              role?: string;
            }
          | undefined;

        if (!user) {
          router.replace("/sign-in");
          return;
        }

        if (user.role !== "technician") {
          toast.error("Only technicians can add services.");
          router.replace("/dashboard");
          return;
        }

        setTechnician({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
        });
      } catch {
        toast.error("Unable to load technician information.");
      }
    };

    loadTechnician();
  }, [router]);

  const handleImageChange = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const selectedFiles = Array.from(files);

    if (images.length + selectedFiles.length > 5) {
      toast.error("You can add a maximum of 5 images.");
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (file.type.startsWith("image/") === false) {
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
      id: crypto.randomUUID(),
      file,
      url: "",
      preview: URL.createObjectURL(file),
    }));

    setImages((previous) => [...previous, ...newImages]);
  };

  const handleAddImageURL = () => {
    const value = imageURL.trim();

    if (!value) {
      toast.error("Please enter an image URL.");
      return;
    }

    if (images.length >= 5) {
      toast.error("You can add a maximum of 5 images.");
      return;
    }

    try {
      const parsedURL = new URL(value);

      if (
        parsedURL.protocol !== "https:" &&
        parsedURL.protocol !== "http:"
      ) {
        throw new Error("Invalid URL");
      }

      setImages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          url: value,
          preview: value,
        },
      ]);

      setImageURL("");
    } catch {
      toast.error("Please enter a valid image URL.");
    }
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

  const uploadImages = async () => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const uploadedImages: string[] = [];

    for (const image of images) {
      if (image.file) {
        if (!apiKey) {
          throw new Error("ImgBB API key is missing.");
        }

        const formData = new FormData();
        formData.append("image", image.file);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          throw new Error(`Failed to upload ${image.file.name}.`);
        }

        uploadedImages.push(result.data.display_url);
      } else {
        uploadedImages.push(image.url);
      }
    }

    return uploadedImages;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (technician.role !== "technician") {
      toast.error("Technician session not found.");
      return;
    }

    if (
      Number.isFinite(Number(basePrice)) === false ||
      Number(basePrice) <= 0
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

    if (description.trim().length < 20) {
      toast.error("Description must contain at least 20 characters.");
      return;
    }

    try {
      setLoading(true);
      setUploading(true);

      const uploadedImages = await uploadImages();

      setUploading(false);

      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        method: "GET",
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication token could not be generated.");
      }

      const response = await fetch(`${backendURL}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          image: uploadedImages[0],
          images: uploadedImages,
          basePrice: Number(basePrice),
          estimatedDuration: estimatedDuration.trim(),
          serviceMode,
          serviceArea: serviceArea.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add service.");
      }

      images.forEach((image) => {
        if (image.file) {
          URL.revokeObjectURL(image.preview);
        }
      });

      setTitle("");
      setCategory("");
      setDescription("");
      setBasePrice("");
      setEstimatedDuration("");
      setServiceMode("Home Visit");
      setServiceArea("");
      setImages([]);
      setImageURL("");

      toast.success("Service submitted for admin approval!");

      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-800 p-7 text-white shadow-xl shadow-violet-200 sm:p-10">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 right-32 h-52 w-52 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
              <Wrench size={28} />
            </div>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-200">
                  Technician Workspace
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Add New Service
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                  Create your repair service listing, add service photos, and
                  submit it for admin approval.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white sm:self-auto">
                <CheckCircle2 size={15} />
                New Listing
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Technician Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your account information
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Technician Name</label>
                <input
                  value={technician.name}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
                />
              </div>

              <div>
                <label className={labelClass}>Technician Email</label>
                <input
                  value={technician.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Wrench size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Service Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the details of your repair service
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Service Title</label>
                <input
                  required
                  maxLength={100}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Professional Smartphone Repair"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <Tag size={15} className="text-violet-600" />
                    Category
                  </span>
                </label>

                <select
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={inputClass}
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
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <DollarSign size={15} className="text-violet-600" />
                    Base Price (USD)
                  </span>
                </label>

                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={basePrice}
                  onChange={(event) => setBasePrice(event.target.value)}
                  placeholder="e.g. 25"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <Clock3 size={15} className="text-violet-600" />
                    Estimated Duration
                  </span>
                </label>

                <input
                  required
                  value={estimatedDuration}
                  onChange={(event) =>
                    setEstimatedDuration(event.target.value)
                  }
                  placeholder="e.g. 1-2 hours"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Service Mode</label>

                <select
                  required
                  value={serviceMode}
                  onChange={(event) => setServiceMode(event.target.value)}
                  className={inputClass}
                >
                  <option value="Home Visit">Home Visit</option>
                  <option value="Shop Drop-off">Shop Drop-off</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <MapPin size={15} className="text-violet-600" />
                    Service Area
                  </span>
                </label>

                <input
                  required
                  value={serviceArea}
                  onChange={(event) => setServiceArea(event.target.value)}
                  placeholder="e.g. Dhanmondi 9, Dhaka"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Enter the specific area where you provide this service.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <FileText size={15} className="text-violet-600" />
                    Service Description
                  </span>
                </label>

                <textarea
                  required
                  rows={5}
                  minLength={20}
                  maxLength={1000}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe your repair service, the problems you can fix, and the support you provide..."
                  className={`${inputClass} resize-none`}
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {description.length}/1000 characters
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700">
                  <Images size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Service Gallery
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add photos to showcase your repair service
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
                {images.length}/5 Images
              </span>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-6 text-center transition hover:border-violet-400">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                <ImagePlus size={28} />
              </div>

              <h3 className="font-bold text-slate-800">
                Upload Service Photos
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Select multiple images from your device. You can upload up to
                5 images, with a maximum size of 5MB per image.
              </p>

              <label
                className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md transition ${
                  images.length >= 5
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-violet-600 shadow-violet-200 hover:bg-violet-700"
                }`}
              >
                <Upload size={17} />
                Choose Images

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={images.length >= 5}
                  className="hidden"
                  onChange={(event) => {
                    handleImageChange(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Or add image URL
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                value={imageURL}
                onChange={(event) => setImageURL(event.target.value)}
                disabled={images.length >= 5}
                placeholder="https://example.com/image.jpg"
                className={`${inputClass} flex-1`}
              />

              <button
                type="button"
                onClick={handleAddImageURL}
                disabled={images.length >= 5}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />
                Add URL
              </button>
            </div>

            {images.length > 0 ? (
              <div className="mt-7">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">
                    Selected Images
                  </h3>

                  <span className="text-xs text-slate-400">
                    First image will be the main image
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={image.preview}
                        alt={`Service image ${index + 1}`}
                        className="h-36 w-full object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                          Main Image
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow transition hover:bg-rose-600 hover:text-white"
                        aria-label="Remove image"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-xs font-semibold text-slate-600">
                          Image {index + 1}
                        </span>

                        <CheckCircle2
                          size={15}
                          className="text-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-8 text-center">
                <ImagePlus
                  size={30}
                  className="mx-auto mb-3 text-slate-300"
                />
                <p className="text-sm font-semibold text-slate-600">
                  No images selected yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Upload at least one image to continue.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <h3 className="font-bold text-amber-900">
                  Admin Approval Required
                </h3>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Your service will be submitted with Pending approval status.
                  Customers can view and book your service after an admin
                  approves it.
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/technician"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <X size={17} />
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || uploading ? (
                <>
                  <LoaderCircle className="animate-spin" size={19} />
                  {uploading ? "Uploading Images..." : "Submitting Service..."}
                </>
              ) : (
                <>
                  <Upload size={19} />
                  Submit Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}