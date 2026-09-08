"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../ui/Button";

import Input from "../ui/Input";

import {
  changeEmailSchema,
  type ChangeEmailFormValues,
} from "./change-email.schema";

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "./change-password.schema";

import { apiFetch } from "@/lib/apiFetch";

type ValidationError = {
  field: string;
  message: string;
};

export default function AccountSettings() {
  const router = useRouter();

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmailForm,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          setEmailMessage("Authentication required.");
          return;
        }

        const response = await apiFetch("/api/auth/me");

        const result = await response.json();

        if (!response.ok) {
          setEmailMessage(result.message || "Failed to load email.");
          return;
        }

        const email = result.user.email ?? "";

        resetEmailForm({
          email,
        });
      } catch {
        setEmailMessage("Unable to connect to the server.");
      }
    };

    loadProfile();
  }, [resetEmailForm]);

  const onEmailSubmit = async (data: ChangeEmailFormValues) => {
    setEmailMessage("");

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      setEmailMessage("Authentication required.");
      return;
    }

    try {
      const response = await apiFetch("/api/profile/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const validationMessage = result.errors
          ?.map((error: ValidationError) => error.message)
          .join(" ");

        setEmailMessage(
          validationMessage || result.message || "Failed to update email.",
        );

        return;
      }

      setEmailMessage(result.message || "Email updated successfully.");

      resetEmailForm({
        email: data.email,
      });
    } catch {
      setEmailMessage("Unable to connect to the server.");
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
    setPasswordMessage("");

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      setPasswordMessage("Authentication required.");
      return;
    }

    try {
      const response = await apiFetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const validationMessage = result.errors
          ?.map((error: ValidationError) => error.message)
          .join(" ");

        setPasswordMessage(
          validationMessage || result.message || "Failed to update password.",
        );

        return;
      }

      setPasswordMessage(result.message || "Password updated successfully.");

      resetPasswordForm();
    } catch {
      setPasswordMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Email */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="font-serif text-2xl">Email Address</h2>

          <p className="mt-2 text-sm text-secondary">
            Update the email address associated with your account.
          </p>
        </div>

        <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...registerEmail("email")}
            />

            {emailErrors.email && (
              <p className="mt-2 text-sm text-secondary">
                {emailErrors.email.message}
              </p>
            )}

            {emailMessage && (
              <p className="mt-2 text-sm text-secondary">{emailMessage}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/profile")}
            >
              Back
            </Button>

            <Button type="submit" disabled={isEmailSubmitting}>
              {isEmailSubmitting ? "Saving..." : "Change Email"}
            </Button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="font-serif text-2xl">Change Password</h2>

          <p className="mt-2 text-sm text-secondary">
            Update your account password.
          </p>
        </div>

        <form
          onSubmit={handleSubmitPassword(onPasswordSubmit)}
          className="space-y-5"
        >
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium"
            >
              Current Password
            </label>

            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...registerPassword("currentPassword")}
            />

            {passwordErrors.currentPassword && (
              <p className="mt-2 text-sm text-secondary">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium"
            >
              New Password
            </label>

            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...registerPassword("newPassword")}
            />

            {passwordErrors.newPassword && (
              <p className="mt-2 text-sm text-secondary">
                {passwordErrors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm New Password
            </label>

            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...registerPassword("confirmPassword")}
            />

            {passwordErrors.confirmPassword && (
              <p className="mt-2 text-sm text-secondary">
                {passwordErrors.confirmPassword.message}
              </p>
            )}
          </div>

          {passwordMessage && (
            <p className="text-sm text-secondary">{passwordMessage}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? "Saving..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
