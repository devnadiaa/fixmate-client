"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Upload,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Technician = {
  name: string;
  email: string;
  role: string;
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadTechnician = async () => {
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
    };

    loadTechnician();
  }, [router]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setImageURL("");

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const handleImageURLChange = (value: string) => {
    setImageURL(value);
    setImageFile(null);
    setPreview(value);
  };

  const uploadImage = async () => {
    if (imageFile) {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      if (!apiKey) {
        throw new Error("ImgBB API key is missing.");
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      setUploading(false);

      if (result.success !== true) {
        throw new Error("Image upload failed.");
      }

      return result.data.display_url as string;
    }

    if (imageURL.trim()) {
      try {
        const parsedURL = new URL(imageURL.trim());

        if (parsedURL.protocol !== "https:" && parsedURL.protocol !== "http:") {
          throw new Error("Invalid image URL.");
        }

        return imageURL.trim();
      } catch {
        throw new Error("Please enter a valid image URL.");
      }
    }

    throw new Error("Please upload an image or provide an image URL.");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Number(basePrice) <= 0 || Number.isNaN(Number(basePrice))) {
      toast.error("Enter a valid service price.");
      return;
    }

    if (technician.role !== "technician") {
      toast.error("Technician session not found.");
      return;
    }

    try {
      setLoading(true);

      const image = await uploadImage();

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
          image,
          basePrice: Number(basePrice),
          estimatedDuration: estimatedDuration.trim(),
          serviceMode,
          serviceArea: serviceArea.trim(),
          technicianName: technician.name,
          technicianEmail: technician.email,
          approvalStatus: "pending",
          isAvailable: true,
          createdAt: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add service.");
      }

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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/technician"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Wrench size={25} />
          </div>

          <h1 className="text-3xl font-bold">Add New Service</h1>

          <p className="mt-2 text-sm text-violet-100">
            Create your repair service listing and submit it for admin approval.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-9"
        >
          <section>
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Technician Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Technician Name
                </label>
                <input
                  value={technician.name}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Technician Email
                </label>
                <input
                  value={technician.email}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 outline-none"
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Service Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Professional Smartphone Repair"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
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
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Base Price (USD)
                </label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={basePrice}
                  onChange={(event) => setBasePrice(event.target.value)}
                  placeholder="e.g. 25"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estimated Duration
                </label>
                <input
                  required
                  value={estimatedDuration}
                  onChange={(event) =>
                    setEstimatedDuration(event.target.value)
                  }
                  placeholder="e.g. 1-2 hours"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Mode
                </label>
                <select
                  required
                  value={serviceMode}
                  onChange={(event) => setServiceMode(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                >
                  <option value="Home Visit">Home Visit</option>
                  <option value="Shop Drop-off">Shop Drop-off</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Area
                </label>
                <input
                  required
                  value={serviceArea}
                  onChange={(event) => setServiceArea(event.target.value)}
                  placeholder="e.g. Comilla, Bangladesh"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe your repair service..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="mb-2 text-lg font-bold text-slate-900">
              Service Image
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Upload an image using ImgBB or provide an existing image URL.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-7 text-center transition hover:border-violet-400 hover:bg-violet-50">
                <ImagePlus className="mb-3 text-violet-600" size={30} />
                <span className="font-semibold text-slate-800">
                  Upload Image
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Choose an image from your device
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    handleImageChange(event.target.files?.[0] || null)
                  }
                />
              </label>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Or Enter Image URL
                </label>
                <input
                  type="url"
                  value={imageURL}
                  onChange={(event) =>
                    handleImageURLChange(event.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {preview && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={preview}
                  alt="Service preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}

            {imageFile && (
              <p className="mt-2 text-sm text-slate-500">
                Selected: {imageFile.name}
              </p>
            )}
          </section>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Your service will be submitted with Pending approval status. It
            becomes available to customers after admin approval.
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading || uploading ? (
              <>
                <LoaderCircle className="animate-spin" size={20} />
                {uploading ? "Uploading Image..." : "Submitting Service..."}
              </>
            ) : (
              <>
                <Upload size={20} />
                Submit Service
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}