"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Button from "../ui/Button";
import Input from "../ui/Input";

import { profileSchema, type ProfileFormValues } from "./profile.schema";

export default function EditProfileForm() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Romario Traveler",
      phone: "",
      bio: "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; //отримали файл (фото) з інпуту, якщо він є. Якщо файлу немає, функція повертає undefined.

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file); //створюємо тимчасовий URL для попереднього перегляду зображення, використовуючи метод URL.createObjectURL(). Цей метод створює тимчасовий URL, який можна використовувати для відображення зображення в браузері без необхідності завантажувати його на сервер.

    setAvatarPreview(previewUrl); //оновлюємо стан avatarPreview, щоб зберегти URL для попереднього перегляду зображення. Це дозволяє відобразити вибране зображення користувачу перед його завантаженням на сервер.
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]); //цей useEffect виконує функцію очищення, яка викликається при розмонтуванні компонента або зміні avatarPreview. Якщо avatarPreview існує, викликається URL.revokeObjectURL(avatarPreview), щоб звільнити ресурси, пов'язані з тимчасовим URL. Це допомагає уникнути витоків пам'яті та забезпечує ефективне управління ресурсами.

  const onSubmit = async (data: ProfileFormValues) => {
    const accessToken = sessionStorage.getItem("accessToken");

    setMessage("");

    if (!accessToken) {
      setMessage("Authentication required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Failed to update profile.");
        return;
      }

      setMessage(result.message);
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
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full text-sm"
            />

            <p className="mt-2 text-xs text-secondary">
              Choose an image for your profile avatar.
            </p>
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
      <div className="flex items-center justify-between gap-4">
        {message && <p className="text-sm text-secondary">{message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
