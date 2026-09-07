"use client";

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

export default function AccountSettings() {
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: {
      errors: emailErrors,
      isSubmitting: isEmailSubmitting,
    },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),

    defaultValues: {
      email: "romariotraveler@gmail.com",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: {
      errors: passwordErrors,
      isSubmitting: isPasswordSubmitting,
    },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onEmailSubmit = (
    data: ChangeEmailFormValues,
  ) => {
    console.log("Change email:", data);
  };

  const onPasswordSubmit = (
    data: ChangePasswordFormValues,
  ) => {
    console.log("Change password:", data);

    resetPasswordForm();
  };

  return (
    <div className="space-y-8">
      {/* Email */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="font-serif text-2xl">
            Email Address
          </h2>

          <p className="mt-2 text-sm text-secondary">
            Update the email address associated with your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmitEmail(onEmailSubmit)}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
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
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isEmailSubmitting}
            >
              {isEmailSubmitting
                ? "Saving..."
                : "Change Email"}
            </Button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="font-serif text-2xl">
            Change Password
          </h2>

          <p className="mt-2 text-sm text-secondary">
            Update your account password.
          </p>
        </div>

        <form
          onSubmit={handleSubmitPassword(
            onPasswordSubmit,
          )}
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
              {...registerPassword(
                "currentPassword",
              )}
            />

            {passwordErrors.currentPassword && (
              <p className="mt-2 text-sm text-secondary">
                {
                  passwordErrors.currentPassword
                    .message
                }
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
                {
                  passwordErrors.newPassword
                    .message
                }
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
              {...registerPassword(
                "confirmPassword",
              )}
            />

            {passwordErrors.confirmPassword && (
              <p className="mt-2 text-sm text-secondary">
                {
                  passwordErrors.confirmPassword
                    .message
                }
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPasswordSubmitting}
            >
              {isPasswordSubmitting
                ? "Saving..."
                : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}