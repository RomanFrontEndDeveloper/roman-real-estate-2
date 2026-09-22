"use client";

import { useEffect, useState } from "react";

import AgencyCard from "./AgencyCard";

type Agency = {
  _id: string;
  name: string;
  agentsCount: number;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: {
      url: string;
      publicId: string;
    };
  };
};

type AgenciesResponse = {
  success: boolean;
  data: Agency[];
};

export default function AllAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/agency");

        if (!response.ok) {
          throw new Error("Failed to load agencies");
        }

        const data: AgenciesResponse = await response.json();

        setAgencies(data.data);
      } catch (error) {
        console.error("Failed to load agencies:", error);

        setError("Unable to load agencies.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAgencies();
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="py-16 text-center">
          <p className="font-serif text-2xl text-secondary">
            Loading agencies...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-border bg-white p-8 text-center">
          <p className="font-serif text-2xl text-primary">
            Unable to load agencies
          </p>

          <p className="mt-3 text-secondary">{error}</p>
        </div>
      </section>
    );
  }

  if (agencies.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-border bg-white p-10 text-center">
          <p className="font-serif text-2xl">No agencies found</p>

          <p className="mt-2 text-secondary">
            There are no registered agencies yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Our Network
        </p>

        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
          Real Estate Agencies
        </h1>

        <p className="mt-3 max-w-2xl text-secondary">
          Explore real estate agencies and meet their professional agents.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {agencies.map((agency) => (
          <AgencyCard
            key={agency._id}
            id={agency._id}
            name={agency.name}
            agentsCount={agency.agentsCount}
            ownerName={agency.owner.name}
            ownerAvatar={agency.owner.avatar?.url}
          />
        ))}
      </div>
    </section>
  );
}
