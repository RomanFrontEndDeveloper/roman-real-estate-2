"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { API_URL } from "@/lib/apiUrl";

import Button from "../ui/Button";
import Input from "../ui/Input";

type UserRole = "agency" | "agent" | "owner-client";

type ValidationError = {
  field: string;
  message: string;
};

type RegisterResponse = {
  message?: string;
  errors?: ValidationError[];
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
};

const USER_ROLES: UserRole[] = ["agency", "agent", "owner-client"];

const isUserRole = (value: string): value is UserRole => {
  return USER_ROLES.includes(value as UserRole);
};

export default function RegisterForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setMessage("");

    if (passwordMismatch) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const roleValue = String(formData.get("role") ?? "");

    if (!isUserRole(roleValue)) {
      setMessage("Invalid account type.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: roleValue,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        const validationMessage = data.errors
          ?.map((error) => error.message)
          .join(" ");

        setMessage(validationMessage || data.message || "Registration failed.");

        return;
      }

      form.reset();

      setPassword("");
      setConfirmPassword("");

      router.replace("/login");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="role" className="mb-2 block text-sm font-medium">
          Account Type
        </label>

        <select
          id="role"
          name="role"
          defaultValue="owner-client"
          disabled={isLoading}
          className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="owner-client">Property Owner</option>

          <option value="agent">Real Estate Agent</option>

          <option value="agency">Real Estate Agency</option>
        </select>
      </div>

      <Input
        name="name"
        type="text"
        placeholder="Full name"
        autoComplete="name"
        required
        disabled={isLoading}
      />

      <Input
        name="email"
        type="email"
        placeholder="Email address"
        autoComplete="email"
        required
        disabled={isLoading}
      />

      <Input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="new-password"
        required
        disabled={isLoading}
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <div>
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          required
          disabled={isLoading}
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
          }}
        />

        {passwordMismatch && (
          <p role="alert" className="mt-2 text-sm text-red-500">
            Passwords do not match.
          </p>
        )}
      </div>

      {message && (
        <p role="alert" className="text-sm text-secondary">
          {message}
        </p>
      )}

      <Button type="submit" disabled={isLoading || passwordMismatch}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
