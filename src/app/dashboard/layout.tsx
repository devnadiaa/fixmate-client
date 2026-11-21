"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  UserRound,
  Users,
  ClipboardList,
  PlusCircle,
  BriefcaseBusiness,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";

type UserRole = "customer" | "technician" | "admin";

const dashboardLinks: Record<UserRole, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

const menuItems: Record<
  UserRole,
  { title: string; href: string; icon: typeof LayoutDashboard }[]
> = {
  customer: [
    {
      title: "Dashboard",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      title: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: CalendarCheck,
    },
    {
      title: "My Payments",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    {
      title: "Update Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ],
  technician: [
    {
      title: "Dashboard",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      title: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      title: "My Services",
      href: "/dashboard/technician/my-services",
      icon: BriefcaseBusiness,
    },
    {
      title: "Manage Requests",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
    {
      title: "Update Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Manage Services",
      href: "/dashboard/admin/services",
      icon: BriefcaseBusiness,
    },
    {
      title: "All Bookings",
      href: "/dashboard/admin/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    {
      title: "Update Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ],
};

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const user = session?.user;

  const role =
    (user as { role?: UserRole } | undefined)?.role || "customer";

  const isProfilePage = pathname === "/dashboard/profile";

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    if (
      role !== "customer" &&
      role !== "technician" &&
      role !== "admin"
    ) {
      router.replace("/sign-in");
      return;
    }

    if (!isProfilePage && !pathname.startsWith(`/dashboard/${role}`)) {
      router.replace(dashboardLinks[role]);
    }
  }, [isPending, user, role, pathname, isProfilePage, router]);

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

  const displayName = profileData?.name ?? user?.name ?? "User";
  const displayImage = profileData?.image ?? user?.image ?? "";

  const isAuthorized =
    user &&
    (isProfilePage || pathname.startsWith(`/dashboard/${role}`));

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  if (isPending || !isAuthorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 lg:hidden">
          <span className="font-bold text-slate-900">Dashboard Menu</span>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="border-b border-slate-100 px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Wrench size={25} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Fix<span className="text-blue-600">Mate</span>
              </h2>

              <p className="text-xs font-medium capitalize text-slate-500">
                {role} Panel
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          {menuItems[role].map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <Icon size={19} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <Home size={19} />
            Back to Home
          </Link>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open dashboard menu"
            >
              <Menu size={23} />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your FixMate account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-600 sm:flex"
            >
              <Home size={17} />
              Home
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-3 transition hover:border-violet-300 hover:bg-violet-50"
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Profile"
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <UserRound size={20} />
                </div>
              )}

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
                  {displayName}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {role}
                </p>
              </div>

              <Settings size={16} className="hidden text-slate-400 sm:block" />
            </Link>
          </div>
        </header>

        <div>{children}</div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}