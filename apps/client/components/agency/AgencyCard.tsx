"use client";

import Image from "next/image";
import Link from "next/link";

import Button from "../ui/Button";
import { useAuth } from "@/components/auth/AuthContext";

type AgencyCardProps = {
  id: string;
  name: string;
  agentsCount: number;
  ownerName: string;
  ownerId: string;
  ownerAvatar?: string;
};

export default function AgencyCard({
  id,
  name,
  agentsCount,
  ownerName,
  ownerId,
  ownerAvatar,
}: AgencyCardProps) {
  const { user, loading } = useAuth();

  const isOwnAgency = String(user?._id ?? "") === String(ownerId ?? "");

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-64 shrink-0 bg-gray-100">
        {ownerAvatar ? (
          <Image
            src={ownerAvatar}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-secondary">Agency Photo</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">
          Real Estate Agency
        </p>

        <h2 className="mt-2 break-words font-serif text-2xl">{name}</h2>

        <p className="mt-3 text-sm text-secondary">Managed by {ownerName}</p>

        <p className="mt-2 text-sm text-secondary">
          {agentsCount} {agentsCount === 1 ? "Agent" : "Agents"}
        </p>

        <div className="mt-auto flex gap-3 pt-5">
          <Link href={`/agency/${id}`} className="flex-1">
            <Button className="w-full">Details →</Button>
          </Link>

          {!loading && user?._id !== ownerId && (
            <Link
              href={`/messages?userId=${ownerId}`}
              className="flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:opacity-85"
            >
              Contact Agency
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
