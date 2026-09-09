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

export default function ProfileCard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  if (isLoading) {
    return (
      <Card className="mx-auto max-w-2xl">
        <div className="py-12 text-center">
          <p className="font-serif text-2xl text-secondary">Loading profile...</p>
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
    <Card className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        {user.avatar?.url ? (
          <Image
            src={user.avatar.url}
            alt={user.name}
            className="h-24 w-24 rounded-full object-cover"
            width={96}
            height={96}
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold">
            {initials}
          </div>
        )}

        {/* Basic Information */}
        <div className="mt-6">
          <h2 className="font-serif text-3xl">{user.name}</h2>

          <p className="mt-2 text-secondary">{user.email}</p>

          <span className="mt-4 inline-block rounded-full bg-gray-100 px-4 py-1.5 text-sm">
            {user.role}
          </span>
        </div>
      </div>

      {/* Profile Information */}
      <div className="mt-10 border-t border-border pt-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-secondary">Full Name</p>

            <p className="mt-1 font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-secondary">Email</p>

            <p className="mt-1 font-medium">{user.email}</p>
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

            <p className="mt-1 font-medium">{user.role}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <p className="text-sm text-secondary">Bio</p>

          <p className={`mt-1 font-medium ${user.bio ? "" : "text-secondary"}`}>
            {user.bio || "No bio yet."}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end">
        <Link href="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    </Card>
  );
}
