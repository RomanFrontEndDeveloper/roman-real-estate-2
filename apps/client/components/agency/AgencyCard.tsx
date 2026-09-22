import Image from "next/image";
import Link from "next/link";

import Button from "../ui/Button";

type AgencyCardProps = {
  id: string;
  name: string;
  agentsCount: number;
  ownerName: string;
  ownerAvatar?: string;
};

export default function AgencyCard({
  id,
  name,
  agentsCount,
  ownerName,
  ownerAvatar,
}: AgencyCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-64 bg-gray-100">
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

      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">
          Real Estate Agency
        </p>

        <h2 className="mt-2 break-words font-serif text-2xl">{name}</h2>

        <p className="mt-3 text-sm text-secondary">Managed by {ownerName}</p>

        <p className="mt-2 text-sm text-secondary">
          {agentsCount} {agentsCount === 1 ? "Agent" : "Agents"}
        </p>

        <div className="mt-5">
          <Link href={`/agency/${id}`}>
            <Button className="w-full">Details →</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
