"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const imgbbAPIKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

type Profile = {
  name: string;
  email: string;
  role: string;
  image: string;
  phone: string;
  area: string;
  bio: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    role: "",
    image: "",
    phone: "",
    area: "",
    bio: "",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
          credentials: "include",
        });

        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok === false || tokenData.token === undefined) {
          toast.error("Please sign in first.");
          return;
        }

        const response = await fetch(`${backendURL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        const data = await response.json();

        if (response.ok === false) {
          toast.error(data.message || "Failed to load profile.");
          return;
        }

        setProfile({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
          image: data.image || "",
          phone: data.phone || "",
          area: data.area || "",
          bio: data.bio || "",
        });

        setPreview(data.image || "");
      } catch {
        toast.error("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith("image/") === false) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    if (!imgbbAPIKey) {
      toast.error("ImgBB API key is missing.");
      event.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok === false || data.success === false) {
        toast.error("Image upload failed.");
        setPreview(profile.image);
        return;
      }

      setProfile((previous) => ({
        ...previous,
        image: data.data.url,
      }));

      setPreview(data.data.url);
      toast.success("Profile picture uploaded successfully.");
    } catch {
      toast.error("Unable to upload image.");
      setPreview(profile.image);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (uploading) {
      toast.info("Please wait for image upload to finish.");
      return;
    }

    setSaving(true);

    try {
      const tokenResponse = await fetch(`${backendURL}/api/auth/token`, {
        credentials: "include",
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok === false || tokenData.token === undefined) {
        toast.error("Please sign in again.");
        return;
      }

      const response = await fetch(`${backendURL}/api/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          image: profile.image,
          phone: profile.phone,
          area: profile.area,
          bio: profile.bio,
        }),
      });

      const data = await response.json();

      if (response.ok === false) {
        toast.error(data.message || "Profile update failed.");
        return;
      }

      window.dispatchEvent(
        new CustomEvent("fixmate-profile-updated", {
          detail: {
            name: profile.name,
            image: profile.image,
          },
        })
      );

      toast.success("Profile updated successfully.");

      const dashboardLinks: Record<string, string> = {
        customer: "/dashboard/customer",
        technician: "/dashboard/technician",
        admin: "/dashboard/admin",
      };

      router.push(dashboardLinks[profile.role] || "/dashboard/customer");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/customer"
          className="text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Update Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your profile picture and personal information.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex flex-col items-center rounded-2xl bg-purple-50 px-5 py-8">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-200 text-4xl font-bold text-purple-700">
                  {profile.name.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <h2 className="mt-4 font-semibold text-gray-900">
                Profile Picture
              </h2>

              <label className="mt-3 cursor-pointer rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700">
                {uploading ? "Uploading..." : "Upload Picture"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG or WebP. Maximum size 5MB.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Account Role
              </label>
              <input
                type="text"
                value={profile.role}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 capitalize text-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Area / Location
              </label>
              <input
                type="text"
                name="area"
                value={profile.area}
                onChange={handleChange}
                placeholder="Enter your area"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                About Me
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Write something about yourself..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}