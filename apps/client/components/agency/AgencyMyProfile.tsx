"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AgencyMembers from "./AgencyMembers";
import { apiFetch } from "@/lib/apiFetch";

type AgencyOwner = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  role: "agency";
  avatar?: {
    url: string;
    publicId: string;
  };
};

type Agency = {
  _id: string;
  name: string;
  owner: AgencyOwner;
  createdAt: string;
  updatedAt: string;
};

type AgencyResponse = {
  success: boolean;
  data: Agency;
};

export default function AgencyMyProfile() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAgency = async () => {
      try {
        setIsLoading(true);
        setError("");

        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          setError("Authentication required");
          return;
        }

        const response = await apiFetch("/api/agency/me");

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(data?.message || "Failed to load agency");
        }

        const data: AgencyResponse = await response.json();

        setAgency(data.data);
      } catch (error) {
        console.error("Failed to load agency:", error);

        setError(
          error instanceof Error ? error.message : "Unable to load agency",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAgency();
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="font-serif text-2xl text-secondary">
            Loading agency...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="font-serif text-2xl text-primary">
            Unable to load agency
          </p>

          <p className="mt-3 text-secondary">{error}</p>
        </div>
      </section>
    );
  }

  if (!agency) {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 mb-5">
      <AgencyMembers />
    </main>
  );
}
