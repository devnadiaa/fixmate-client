"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

type User = {
  _id?: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

export default function ManageUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [adminEmail, setAdminEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("customer");
  const [updating, setUpdating] = useState(false);

  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const session = await authClient.getSession();
        const user = session.data?.user as
          | { email?: string; role?: string }
          | undefined;

        if (user === undefined) {
          router.push("/sign-in");
          return;
        }

        if (user.role !== "admin") {
          toast.error("Admin access required.");
          router.push("/dashboard/customer");
          return;
        }

        setAdminEmail(user.email || "");

        const tokenResponse = await fetch(
          `${backendURL}/api/auth/token`,
          { credentials: "include" }
        );

        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok === false || tokenData.token === undefined) {
          toast.error("Authentication failed.");
          return;
        }

        const response = await fetch(`${backendURL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        if (response.ok === false) {
          toast.error("Failed to load users.");
          return;
        }

        const data = await response.json();
        setUsers(data);
      } catch {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [router, backendURL]);

  const openRoleModal = (user: User) => {
    if (user.email === adminEmail) {
      toast.error("You cannot change your own role.");
      return;
    }

    setSelectedUser(user);
    setNewRole(user.role);
  };

  const updateRole = async () => {
    if (selectedUser === null) return;

    try {
      setUpdating(true);

      const tokenResponse = await fetch(
        `${backendURL}/api/auth/token`,
        { credentials: "include" }
      );

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok === false || tokenData.token === undefined) {
        toast.error("Authentication failed.");
        return;
      }

      const response = await fetch(
        `${backendURL}/api/admin/users/${encodeURIComponent(selectedUser.email)}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await response.json();

      if (response.ok === false) {
        toast.error(data.message || "Failed to update user role.");
        return;
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.email === selectedUser.email
            ? { ...user, role: newRole }
            : user
        )
      );

      toast.success("User role updated successfully.");
      setSelectedUser(null);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-slate-600">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-700">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage Users
          </h1>
          <p className="mt-2 text-slate-500">
            View registered users and manage their account roles.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Total Users", value: users.length },
            {
              title: "Customers",
              value: users.filter((user) => user.role === "customer").length,
            },
            {
              title: "Technicians",
              value: users.filter((user) => user.role === "technician").length,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {item.title}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500 sm:flex-1"
          />

          <select
            value={filterRole}
            onChange={(event) => setFilterRole(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              Registered Users ({filteredUsers.length})
            </h2>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                No Users Found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                No users match your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.email} className="hover:bg-slate-50">
                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {user.name}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold capitalize text-violet-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Not available"}
                      </td>
                      <td className="px-6 py-5">
                        {user.email === adminEmail ? (
                          <span className="text-xs font-medium text-slate-400">
                            Current Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => openRoleModal(user)}
                            className="rounded-lg bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-200"
                          >
                            Change Role
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedUser !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">
              Change User Role
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Update the role for {selectedUser.name}.
            </p>

            <label className="mt-6 block text-sm font-semibold text-slate-700">
              Select Role
            </label>

            <select
              value={newRole}
              onChange={(event) => setNewRole(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
            >
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
            </select>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                disabled={updating}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={updateRole}
                disabled={updating || newRole === selectedUser.role}
                className="rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}