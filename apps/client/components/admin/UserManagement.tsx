"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/apiFetch";
import BackButton from "../ui/BackButton";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
};

type UsersResponse = {
  success: boolean;
  data: AdminUser[];
  message?: string;
};

type UpdateUserResponse = {
  success: boolean;
  message: string;
  data: AdminUser;
};

async function fetchUsers(): Promise<AdminUser[]> {
  const response = await apiFetch("/api/admin/users");

  const result = (await response.json()) as UsersResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "Failed to load users");
  }

  return result.data;
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
      try {
        const data = await fetchUsers();

        if (isActive) {
          setUsers(data);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  const handleBlockToggle = async (user: AdminUser) => {
    const nextIsBlocked = !user.isBlocked;

    setUpdatingUserId(user._id);
    setError("");
    setMessage("");

    try {
      const response = await apiFetch(`/api/admin/users/${user._id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isBlocked: nextIsBlocked,
        }),
      });

      const result = (await response.json()) as UpdateUserResponse;

      if (!response.ok) {
        throw new Error(result.message ?? "Failed to update user");
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === user._id ? result.data : currentUser,
        ),
      );

      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return <p className="py-8 text-secondary">Loading users...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="shrink-0">
        <BackButton />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700"
        >
          {message}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-black/10">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead className="bg-black/[0.03]">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Registered</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/10">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-3 font-medium">{user.name}</td>

                <td className="px-4 py-3">{user.email}</td>

                <td className="px-4 py-3">{user.role}</td>

                <td className="px-4 py-3">
                  {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={
                      user.isBlocked
                        ? "rounded-full bg-red-500/10 px-2.5 py-1 text-red-600"
                        : "rounded-full bg-green-500/10 px-2.5 py-1 text-green-700"
                    }
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={updatingUserId !== null || user.role === "admin"}
                    onClick={() => void handleBlockToggle(user)}
                    className={
                      user.isBlocked
                        ? "rounded-lg border border-green-600 px-3 py-2 text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                        : "rounded-lg border border-red-600 px-3 py-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    }
                  >
                    {updatingUserId === user._id
                      ? "Updating..."
                      : user.isBlocked
                        ? "Unblock"
                        : "Block"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-secondary"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
