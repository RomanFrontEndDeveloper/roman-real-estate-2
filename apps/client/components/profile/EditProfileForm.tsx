"use client";

"use no memo";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { profileSchema, type ProfileFormValues } from "./profile.schema";

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

export default function EditProfileForm() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
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

        const user: User = result.user;

        // Заповнюємо форму даними з бази
        reset({
          name: user.name ?? "",
          phone: user.phone ?? "",
          bio: user.bio ?? "",
        });

        // Показуємо поточний avatar
        if (user.avatar?.url) {
          setAvatarPreview(user.avatar.url);
        } else {
          setAvatarPreview(null);
        }
      } catch {
        setMessage("Unable to connect to the server.");
      }
    };

    loadProfile();
  }, [reset]);

  // Вибір нового аватара
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Нове фото скасовує операцію видалення
    setRemoveAvatar(false);

    // Зберігаємо файл для upload
    setAvatarFile(file);

    // Створюємо локальний preview
    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };

  // Очищення тимчасового blob URL
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Видалення аватара
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setRemoveAvatar(true);

    // Очищаємо input type="file",
    // щоб можна було знову вибрати той самий файл
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Відправлення форми
  const onSubmit = async (data: ProfileFormValues) => {
    const accessToken = sessionStorage.getItem("accessToken");

    setMessage("");

    if (!accessToken) {
      setMessage("Authentication required.");
      return;
    }

    try {
      // ==========================================
      // 1. Оновлюємо текстові дані профілю
      // ==========================================

      const profileResponse = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify({
          ...data,
          removeAvatar,
        }),
      });

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok) {
        setMessage(profileResult.message || "Failed to update profile.");
        return;
      }

      // Зберігаємо актуального користувача
      let updatedUser: User = profileResult.user;

      // ==========================================
      // 2. Якщо вибрали новий avatar
      // ==========================================

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

        // Backend повернув user вже з новим avatar
        updatedUser = {
          ...updatedUser,
          ...avatarResult.user,
        };

        // Після успішного upload
        // показуємо справжній URL Cloudinary
        if (avatarResult.user?.avatar?.url) {
          setAvatarPreview(avatarResult.user.avatar.url);
        }
      }

      // ==========================================
      // 3. Повідомляємо Header,
      //    що профіль змінився
      // ==========================================

      window.dispatchEvent(
        new CustomEvent("profile-change", {
          detail: updatedUser,
        }),
      );

      // ==========================================
      // 4. Все успішно
      // ==========================================

      setMessage("Profile updated successfully.");

      // Скидаємо локальні стани
      setAvatarFile(null);
      setRemoveAvatar(false);

      // Очищаємо input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    // React Compiler incorrectly flags react-hook-form's
    // handleSubmit because the library internally uses refs.
    // eslint-disable-next-line react-hooks/refs
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div>
        <label htmlFor="avatar" className="mb-3 block text-sm font-medium">
          Avatar
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Avatar preview */}
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
              "FOTO"
            )}
          </div>

          <div>
            <div className="flex gap-2">
              {/* Choose Photo */}
              <label
                htmlFor="avatar"
                className="inline-flex cursor-pointer items-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
              >
                Choose Photo
              </label>

              {/* Remove Photo */}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
                >
                  Remove Photo
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
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
      <div className="flex items-center justify-end gap-3">
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
