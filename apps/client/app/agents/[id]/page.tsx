import Image from "next/image";
import Link from "next/link";

import PropertyCard from "@/components/property/PropertyCard";

import BackButton from "@/components/ui/BackButton";
import { API_URL } from "@/lib/apiUrl";

type Agent = {
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

type Property = {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: "UAH" | "USD";
  listingType: "sale" | "rent";
  location: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms: number;
  kitchenArea: number;
  area: number;
  owner: string;
  mainImage: string;
  images: string[];
};

type AgentResponse = {
  success: boolean;
  data: {
    agent: Agent;
    properties: Property[];
  };
};

type AgentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params;

  const response = await fetch(`${API_URL}/api/profile/agents/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h1 className="font-serif text-4xl">Agent not found</h1>

          <p className="mt-3 text-secondary">
            The requested agent could not be found.
          </p>

          <Link
            href="/agents"
            className="mt-6 inline-block rounded-lg border border-border bg-white px-5 py-2 text-sm"
          >
            Back to Agents
          </Link>
        </div>
      </section>
    );
  }

  const data: AgentResponse = await response.json();

  const { agent, properties } = data.data;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Agent profile */}
      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="grid md:grid-cols-[360px_1fr]">
          {/* Avatar */}
          <div className="relative h-[420px] bg-gray-100 sm:h-[480px] md:h-full md:min-h-[460px]">
            {agent.avatar?.url ? (
              <Image
                src={agent.avatar.url}
                alt={agent.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 360px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-secondary">Agent Photo</span>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              {/* Label */}
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-secondary">
                Real Estate Agent
              </p>

              {/* Name */}
              <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-primary sm:text-5xl">
                {agent.name}
              </h1>

              {/* Bio */}
              {agent.bio && (
                <p className="mt-5 max-w-2xl text-base leading-7 text-secondary sm:text-lg">
                  {agent.bio}
                </p>
              )}

              {/* Divider */}
              <div className="my-7 h-px bg-border" />

              {/* Contact */}
              <div className="space-y-4">
                {agent.phone && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-secondary mb-3">
                      Phone
                    </p>

                    <p className="mt-1 text-3xl text-primary">{agent.phone}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-wider text-secondary mb-3">
                    Email
                  </p>

                  <p className="mt-1 break-all text-xl text-primary">
                    {agent.email}
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <p className="font-serif text-3xl text-primary">
                    {properties.length}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wider text-secondary">
                    Properties
                  </p>
                </div>

                <div>
                  <p className="font-serif text-3xl text-primary">Agent</p>

                  <p className="mt-1 text-xs uppercase tracking-wider text-secondary">
                    Role
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom action */}
            <div className="mt-8 border-t border-border pt-9">
              <BackButton />
            </div>
          </div>
        </div>
      </section>

      {/* Agent properties */}
      <section className="mt-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Portfolio
          </p>

          <h2 className="mt-2 font-serif text-4xl">
            Properties by {agent.name}
          </h2>

          <p className="mt-3 text-secondary">Properties owned by this agent.</p>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white py-16 text-center">
            <p className="font-serif text-2xl">No properties yet</p>

            <p className="mt-2 text-secondary text-2xl">
              This agent currently has no listed properties.
            </p>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                id={property._id}
                title={property.title}
                description={property.description}
                price={property.price}
                currency={property.currency}
                location={property.location}
                propertyType={property.propertyType}
                listingType={property.listingType}
                bedrooms={property.bedrooms}
                area={property.area}
                mainImage={property.mainImage}
                images={property.images}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
