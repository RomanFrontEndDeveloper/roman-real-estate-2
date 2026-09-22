"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import Image from "next/image";

import Button from "../ui/Button";

import Card from "../ui/Card";

import { apiFetch } from "@/lib/apiFetch";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agency" | "agent" | "owner-client";
  phone?: string;
  bio?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
};

type MeResponse = {
  user: User;
};

type AgencyMembership = {
  _id: string;
  agency: {
    _id: string;
    name: string;
  };
};

export default function ProfileCard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [agencyMembership, setAgencyMembership] =
    useState<AgencyMembership | null>(null);

  const [isLeavingAgency, setIsLeavingAgency] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          router.replace("/login");
          return;
        }

        const response = await apiFetch("/api/auth/me");

        if (!response.ok) {
          sessionStorage.removeItem("accessToken");
          window.dispatchEvent(new Event("auth-change"));
          router.replace("/login");
          return;
        }

        const data: MeResponse = await response.json();

        setUser(data.user);

        if (data.user.role === "agent") {
          const membershipResponse = await apiFetch(
            "/api/agency/membership/me",
          );

          if (membershipResponse.ok) {
            const membershipData = await membershipResponse.json();

            setAgencyMembership(membershipData.data);
          }
        }
      } catch {
        sessionStorage.removeItem("accessToken");
        window.dispatchEvent(new Event("auth-change"));
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleLeaveAgency = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this agency?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsLeavingAgency(true);

      const response = await apiFetch("/api/agency/membership/me", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to leave agency");
      }

      setAgencyMembership(null);
    } catch (error) {
      console.error("Failed to leave agency:", error);

      alert(error instanceof Error ? error.message : "Failed to leave agency");
    } finally {
      setIsLeavingAgency(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <div className="py-10 text-center">
          <p className="font-serif text-2xl text-secondary">
            Loading profile...
          </p>
        </div>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="w-full p-5 sm:p-6 lg:p-8">
      <div className="grid gap-8 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]">
        {/* Avatar */}
        <div className="flex items-start justify-center md:justify-start">
          {user.avatar?.url ? (
            <Image
              src={user.avatar.url}
              alt={user.name}
              width={200}
              height={200}
              className="h-40 w-40 rounded-2xl object-cover sm:h-44 sm:w-44 lg:h-48 lg:w-48"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-gray-100 text-3xl font-semibold sm:h-44 sm:w-44 lg:h-48 lg:w-48">
              {initials}
            </div>
          )}
        </div>

        {/* Main information */}
        <div className="min-w-0">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm uppercase tracking-[0.25em] text-secondary">
                My Profile
              </p>

              <h2 className="mt-2 break-words font-serif text-3xl sm:text-4xl">
                {user.name}
              </h2>

              <p className="mt-2 break-all text-secondary">{user.email}</p>
            </div>

            <span className="w-fit shrink-0 rounded-full bg-gray-100 px-4 py-1.5 text-sm capitalize">
              {user.role}
            </span>
          </div>

          {/* Profile information */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-secondary">Full Name</p>

              <p className="mt-1 font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-secondary">Email</p>

              <p className="mt-1 break-all font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-secondary">Phone</p>

              <p
                className={`mt-1 font-medium ${
                  user.phone ? "" : "text-secondary"
                }`}
              >
                {user.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-secondary">Role</p>

              <p className="mt-1 font-medium capitalize">{user.role}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-5">
            <p className="text-sm text-secondary">Bio</p>

            <p
              className={`mt-1 font-medium ${user.bio ? "" : "text-secondary"}`}
            >
              {user.bio || "No bio yet."}
            </p>
          </div>

          {user.role === "agent" && agencyMembership && (
            <div className="mt-6 border-t border-border pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-secondary">Agency</p>

                  <p className="mt-1 font-medium">
                    {agencyMembership.agency.name}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLeaveAgency}
                  disabled={isLeavingAgency}
                >
                  {isLeavingAgency ? "Leaving..." : "Leave Agency"}
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Link href="/property" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                My Properties
              </Button>
            </Link>

            <Link href="/profile/edit" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Edit Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
