"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import Image from "next/image";

import Button from "../ui/Button";

import Input from "../ui/Input";

import { profileSchema, type ProfileFormValues } from "./profile.schema";

export default function EditProfileForm() {
  const router = useRouter();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      name: "",
      phone: "",
      bio: "",
    },
  });

  // Завантажуємо поточні дані профілю
  useEffect(() => {
    const loadProfile = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        setMessage("Authentication required.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          setMessage(result.message || "Failed to load profile.");
          return;
        }

        const user = result.user;

        // Заповнюємо форму даними з бази
        reset({
          name: user.name ?? "",
          phone: user.phone ?? "",
          bio: user.bio ?? "",
        });

        // Показуємо поточний avatar
        if (user.avatar?.url) {
          setAvatarPreview(user.avatar.url);
        }
      } catch {
        setMessage("Unable to connect to the server.");
      }
    };

    loadProfile();
  }, [reset]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarFile(file);

    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const onSubmit = async (data: ProfileFormValues) => {
    const accessToken = sessionStorage.getItem("accessToken");

    setMessage("");

    if (!accessToken) {
      setMessage("Authentication required.");
      return;
    }

    try {
      // 1. Оновлюємо текстові дані профілю
      const profileResponse = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(data),
      });

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok) {
        setMessage(profileResult.message || "Failed to update profile.");
        return;
      }

      // 2. Якщо вибрали новий аватар — завантажуємо його
      if (avatarFile) {
        const formData = new FormData();

        formData.append("avatar", avatarFile);

        const avatarResponse = await fetch(
          "http://localhost:5000/api/profile/avatar",
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${accessToken}`,
            },

            body: formData,
          },
        );

        const avatarResult = await avatarResponse.json();

        if (!avatarResponse.ok) {
          setMessage(avatarResult.message || "Failed to update avatar.");
          return;
        }
      }

      setMessage("Profile updated successfully");

      setAvatarFile(null);
    } catch {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div>
        <label htmlFor="avatar" className="mb-3 block text-sm font-medium">
          Avatar
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-2xl font-semibold">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              "RT"
            )}
          </div>

          <div>
            <div>
              <label
                htmlFor="avatar"
                className="inline-flex cursor-pointer items-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
              >
                Choose Photo
              </label>

              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <p className="mt-2 text-xs text-secondary">
                Choose an image for your profile avatar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Full Name
        </label>

        <Input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
        />

        {errors.name && (
          <p className="mt-2 text-sm text-secondary">{errors.name.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium">
          Phone
        </label>

        <Input
          id="phone"
          type="tel"
          placeholder="+380..."
          autoComplete="tel"
          {...register("phone")}
        />

        {errors.phone && (
          <p className="mt-2 text-sm text-secondary">{errors.phone.message}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="mb-2 block text-sm font-medium">
          Bio
        </label>

        <textarea
          id="bio"
          rows={5}
          placeholder="Tell us a little about yourself..."
          className="w-full resize-none rounded-lg border border-border px-4 py-3 text-sm outline-none transition focus:border-primary"
          {...register("bio")}
        />

        {errors.bio && (
          <p className="mt-2 text-sm text-secondary">{errors.bio.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 mr-6">
        {message && <p className="mr-auto text-sm text-secondary">{message}</p>}

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/profile")}
        >
          Back
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
