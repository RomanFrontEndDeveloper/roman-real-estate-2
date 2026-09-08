"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

type ForgotPasswordResponse = {
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
};

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    setMessage("");
    setIsLoading(true);

    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data: ForgotPasswordResponse = await response.json();

      if (!response.ok) {
        const validationMessage = data.errors
          ?.map((error) => error.message)
          .join(" ");

        setMessage(
          validationMessage ||
            data.message ||
            "Unable to send password reset email.",
        );

        return;
      }

      form.reset();
      setMessage(
        "If an account with this email exists, a password reset link has been sent.",
      );
      setIsSent(true);
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-4 text-3xl font-semibold">Check your email</h1>

          <p className="mb-6 text-secondary">{message}</p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Back to Login
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

          <h1 className="mb-3 text-3xl font-semibold">Forgot your password?</h1>

          <p className="text-secondary">
            Enter your email address and we will send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            required
          />

          {message && <p className="text-sm text-secondary">{message}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
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
