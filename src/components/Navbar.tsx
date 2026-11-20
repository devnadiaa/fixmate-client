"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  Menu,
  X,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type UserRole = "customer" | "technician" | "admin";

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const role =
    (user as { role?: UserRole } | undefined)?.role || "customer";

  const dashboardLinks: Record<UserRole, string> = {
    customer: "/dashboard/customer",
    technician: "/dashboard/technician",
    admin: "/dashboard/admin",
  };

  useEffect(() => {
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        name: string;
        image: string;
      }>;

      setProfileData(customEvent.detail);
    };

    window.addEventListener("fixmate-profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener(
        "fixmate-profile-updated",
        handleProfileUpdate
      );
    };
  }, []);

  useEffect(() => {
    setProfileData(null);
  }, [user?.id]);

  const displayName = profileData?.name ?? user?.name ?? "";
  const displayImage = profileData?.image ?? user?.image ?? "";

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About Us", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <Wrench size={25} />
          </div>

          <span className="text-2xl font-bold text-slate-900">
            Fix<span className="text-blue-600">Mate</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium transition ${
                isActive(item.href)
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isPending ? null : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-2 pr-3 transition hover:border-blue-300 hover:bg-blue-50"
              >
                {displayImage ? (
                  <img
                    key={displayImage}
                    src={displayImage}
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User size={20} />
                  </div>
                )}

                <span className="max-w-32 truncate text-sm font-semibold text-slate-700">
                  {displayName}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-slate-500 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                  <p className="font-semibold text-slate-900">
                    {displayName}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                    {role}
                  </span>

                  <div className="my-3 border-t border-slate-100" />

                  <Link
                    href={dashboardLinks[role]}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Settings size={18} />
                    Update Profile
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="font-semibold text-slate-700 hover:text-blue-600"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-700 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`font-medium ${
                  isActive(item.href)
                    ? "text-blue-600"
                    : "text-slate-600"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t border-slate-200 pt-4">
              {isPending ? null : user ? (
                <>
                  <div className="flex items-center gap-3">
                    {displayImage ? (
                      <img
                        key={displayImage}
                        src={displayImage}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User size={21} />
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-slate-900">
                        {displayName}
                      </p>

                      <p className="text-sm capitalize text-blue-600">
                        {role}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardLinks[role]}
                    onClick={() => setMenuOpen(false)}
                    className="mt-4 flex items-center gap-2 font-medium text-slate-600"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="mt-3 flex items-center gap-2 font-medium text-slate-600"
                  >
                    <Settings size={18} />
                    Update Profile
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="mt-3 flex items-center gap-2 font-medium text-red-600"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setMenuOpen(false)}
                    className="font-semibold text-blue-600"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-white" />}>
      <NavbarContent />
    </Suspense>
  );
}