"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

type ResetPasswordResponse = {
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setMessage("Reset password token is missing.");
      return;
    }

    const form = event.currentTarget;

    setMessage("");
    setPasswordMismatch(false);
    setIsLoading(true);

    const formData = new FormData(form);

    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      const data: ResetPasswordResponse = await response.json();

      if (!response.ok) {
        const validationMessage = data.errors
          ?.map((error) => error.message)
          .join(" ");

        setMessage(
          validationMessage || data.message || "Unable to reset password.",
        );
        return;
      }

      form.reset();
      setMessage("Your password has been reset successfully.");
      setIsReset(true);
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-4 text-3xl font-semibold">Password Reset</h1>

          <p className="mb-6 text-secondary">{message}</p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-secondary">
            Password Recovery
          </p>

          <h1 className="mb-3 text-3xl font-semibold">Reset your password</h1>

          <p className="text-secondary">Enter your new password below.</p>
        </div>

        {!token && (
          <p className="mb-5 text-sm text-secondary">
            Reset password token is missing or invalid.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="password"
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            required
            onChange={(event) => {
              const value = event.target.value;

              setPassword(value);

              setPasswordMismatch(
                confirmPassword.length > 0 && value !== confirmPassword,
              );
            }}
          />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            required
            onChange={(event) => {
              const value = event.target.value;

              setConfirmPassword(value);

              setPasswordMismatch(password.length > 0 && password !== value);
            }}
          />

          {passwordMismatch && (
            <p className="text-sm text-red-500">Passwords do not match.</p>
          )}
          {message && <p className="text-sm text-secondary">{message}</p>}

          <Button type="submit" disabled={isLoading || !token}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full text-sm text-secondary underline transition hover:opacity-80"
          >
            Back to Login
          </button>
        </form>
      </div>
    </main>
  );
}

function ResetPasswordFallback() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-3xl font-semibold">Reset your password</h1>

        <p className="text-secondary">Loading...</p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
