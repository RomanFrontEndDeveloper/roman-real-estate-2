"use client";

import { useEffect, useState } from "react";

import ProfileCard from "@/components/profile/ProfileCard";
import AgencyJoinRequests from "@/components/agent/AgencyJoinRequests";
import AgencyMyProfile from "@/components/agency/AgencyMyProfile";

import { apiFetch } from "@/lib/apiFetch";

type UserRole = "admin" | "agency" | "agent" | "owner-client";

type MeResponse = {
  user: {
    role: UserRole;
  };
};

export default function ProfilePage() {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const response = await apiFetch("/api/auth/me");

        if (!response.ok) {
          return;
        }

        const data: MeResponse = await response.json();

        setRole(data.user.role);
      } catch (error) {
        console.error("Failed to load user role:", error);
      }
    };

    loadUserRole();
  }, []);

  return (
    <section className="w-full py-6 sm:py-10">
      {/* Profile header + personal profile */}
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-secondary">
            My Profile
          </p>

          <h1 className="mt-4 font-serif text-4xl">Profile</h1>

          <p className="mt-4 text-secondary">
            Manage your personal information and account details.
          </p>
        </div>

        <ProfileCard />
      </div>

      {/* Agent-specific section */}
      {role === "agent" && (
        <div className="mt-10 w-full">
          <AgencyJoinRequests />
        </div>
      )}

      {/* Agency-specific section */}
      {role === "agency" && (
        <div className="mt-10 w-full">
          <AgencyMyProfile />
        </div>
      )}
    </section>
  );
}
