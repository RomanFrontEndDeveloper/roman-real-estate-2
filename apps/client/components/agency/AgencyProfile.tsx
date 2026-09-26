"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/apiUrl";
import Button from "../ui/Button";

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

type AgencyAgent = {
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

type AgencyMember = {
  _id: string;
  agent: AgencyAgent;
};

type Agency = {
  _id: string;
  name: string;
  owner: AgencyOwner;
  members: AgencyMember[];
  createdAt: string;
  updatedAt: string;
};

type AgencyResponse = {
  success: boolean;
  data: Agency;
};

type AgencyProfileProps = {
  agencyId: string;
};

export default function AgencyProfile({ agencyId }: AgencyProfileProps) {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAgency = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/agency/${agencyId}`, {
          cache: "no-store",
        });

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
  }, [agencyId]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="py-16 text-center">
          <p className="font-serif text-2xl text-secondary">
            Loading agency...
          </p>
        </div>
      </main>
    );
  }

  if (error || !agency) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <p className="font-serif text-3xl text-primary">
            Unable to load agency
          </p>

          <p className="mt-3 text-secondary">{error || "Agency not found"}</p>

          <Link href="/agency" className="mt-6 inline-block">
            <Button>← Back to Agencies</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Agency profile */}
      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="grid md:grid-cols-[320px_1fr]">
          {/* Agency photo */}
          <div className="relative h-[320px] bg-gray-100 sm:h-[380px] md:h-full md:min-h-[420px]">
            {agency.owner.avatar?.url ? (
              <Image
                src={agency.owner.avatar.url}
                alt={agency.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-secondary">Agency Photo</span>
              </div>
            )}
          </div>

          {/* Agency information */}
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-secondary">
              Real Estate Agency
            </p>

            <h1 className="mt-3 break-words font-serif text-4xl leading-tight text-primary sm:text-5xl">
              {agency.name}
            </h1>

            <p className="mt-4 text-secondary">
              Managed by {agency.owner.name}
            </p>

            <div className="my-7 h-px bg-border" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-secondary">
                  Agents
                </p>

                <p className="mt-1 font-serif text-3xl text-primary">
                  {agency.members.length}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-secondary">
                  Email
                </p>

                <p className="mt-1 break-all text-primary">
                  {agency.owner.email}
                </p>
              </div>

              {agency.owner.phone && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-secondary">
                    Phone
                  </p>

                  <p className="mt-1 text-primary">{agency.owner.phone}</p>
                </div>
              )}
            </div>

            {agency.owner.bio && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-secondary">
                  About
                </p>

                <p className="mt-1 max-w-3xl leading-7 text-secondary">
                  {agency.owner.bio}
                </p>
              </div>
            )}

            <div className="mt-8">
              <Link href="/agency">
                <Button variant="outline">← Back to Agencies</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agency agents */}
      <section className="mt-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Our Team
          </p>

          <h2 className="mt-2 font-serif text-4xl">Our Agents</h2>

          <p className="mt-3 text-secondary">
            Meet the real estate agents working with this agency.
          </p>
        </div>

        {agency.members.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center">
            <p className="font-serif text-2xl">No agents yet</p>

            <p className="mt-2 text-secondary">
              This agency currently has no agents.
            </p>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agency.members.map((member) => {
              const agent = member.agent;

              return (
                <div
                  key={member._id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="relative h-80 overflow-hidden rounded-xl bg-gray-100">
                    {agent.avatar?.url ? (
                      <Image
                        src={agent.avatar.url}
                        alt={agent.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-secondary">
                          Agent Photo
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <h3 className="font-serif text-2xl">{agent.name}</h3>

                    <p className="mt-2 text-secondary">Real Estate Agent</p>

                    {agent.phone && (
                      <p className="mt-3 text-sm text-secondary">
                        Phone: {agent.phone}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-secondary break-all">
                      Email: {agent.email}
                    </p>

                    {agent.bio && (
                      <p className="mt-3 line-clamp-2 text-sm text-secondary">
                        {agent.bio}
                      </p>
                    )}

                    <div className="mt-5">
                      <Link
                        href={`/agents/${agent._id}`}
                        className="block w-full"
                      >
                        <Button className="h-12 w-full">View Profile →</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
