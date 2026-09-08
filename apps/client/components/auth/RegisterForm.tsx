"use client";

import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

type ValidationError = {
  field: string;
  message: string;
};

type RegisterResponse = {
  message: string;
  errors?: ValidationError[];
  user?: {
    id: string;
    name: string;
    email: string;
    role: "agency" | "agent" | "owner-client";
  };
};

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const [message, setMessage] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;

    setMessage("");

    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? "",
    );
    const role = String(formData.get("role") ?? "");

    // Перевіряємо паролі ДО відправки на сервер
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setMessage("Passwords do not match.");
      return;
    }

    setPasswordMismatch(false);
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        },
      );

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        const validationMessage = data.errors
          ?.map((error) => error.message)
          .join(" ");

        setMessage(
          validationMessage ||
            data.message ||
            "Registration failed.",
        );

        return;
      }

      form.reset();

      setMessage(
        "Registration successful! Please check your email and verify your account.",
      );

      setIsRegistered(true);
    } catch {
      setMessage(
        "Unable to connect to the server. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const password = event.target.value;

    const form = event.currentTarget.form;

    if (!form) {
      return;
    }

    const confirmPassword = String(
      new FormData(form).get("confirmPassword") ?? "",
    );

    if (confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const confirmPassword = event.target.value;

    const form = event.currentTarget.form;

    if (!form) {
      return;
    }

    const password = String(
      new FormData(form).get("password") ?? "",
    );

    if (confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">
          Check your email
        </h2>

        <p className="text-secondary">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Account Type */}
      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium"
        >
          Account Type
        </label>

        <select
          id="role"
          name="role"
          defaultValue="owner-client"
          className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
        >
          <option value="owner-client">
            Property Owner
          </option>

          <option value="agent">
            Real Estate Agent
          </option>

          <option value="agency">
            Real Estate Agency
          </option>
        </select>
      </div>

      {/* Full Name */}
      <Input
        name="name"
        type="text"
        placeholder="Full name"
        autoComplete="name"
        required
      />

      {/* Email */}
      <Input
        name="email"
        type="email"
        placeholder="Email address"
        autoComplete="email"
        required
      />

      {/* Password */}
      <Input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="new-password"
        required
        onChange={handlePasswordChange}
      />

      {/* Confirm Password */}
      <div>
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          required
          onChange={handleConfirmPasswordChange}
        />

        {passwordMismatch && (
          <p className="mt-2 text-sm text-red-500">
            Passwords do not match.
          </p>
        )}
      </div>

      {/* Response Message */}
      {message && (
        <p className="text-sm text-secondary">
          {message}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? "Creating Account..."
          : "Create Account"}
      </Button>
    </form>
  );
}