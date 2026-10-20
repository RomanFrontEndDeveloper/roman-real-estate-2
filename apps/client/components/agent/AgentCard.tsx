"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import Button from "../ui/Button";

export type Agent = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  propertiesCount: number;
};

type AgentCardProps = {
  agent: Agent;
};

export default function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleViewProfile = () => {
    startTransition(() => {
      router.push(`/agents/${agent._id}`);
    });
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
      <div className="relative flex h-85 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {agent.avatar?.url ? (
          <Image
            src={agent.avatar.url}
            alt={agent.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 46vw, 28vw"
          />
        ) : (
          <span className="text-sm text-secondary">Agent Photo</span>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="font-serif text-2xl">{agent.name}</h3>

        <p className="mt-2 text-secondary">Real Estate Agent</p>

        {agent.phone && (
          <p className="mt-3 text-sm text-secondary">Phone: {agent.phone}</p>
        )}

        {agent.email && (
          <p className="mt-1 text-sm text-secondary">Email: {agent.email}</p>
        )}

        {agent.bio && (
          <p className="mt-3 line-clamp-2 text-sm text-secondary">
            {agent.bio}
          </p>
        )}

        <p className="mt-4 text-sm font-medium text-primary">
          {agent.propertiesCount}{" "}
          {agent.propertiesCount === 1 ? "Property" : "Properties"}
        </p>

        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          <Button
            onClick={handleViewProfile}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Loading..." : "View Profile →"}
          </Button>

          <Link
            href={`/messages?userId=${agent._id}`}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-85"
          >
            Contact Agent
          </Link>
        </div>
      </div>
    </div>
  );
}
