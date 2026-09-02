"use client";

import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

type RegisterResponse = {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "agency" | "agent" | "owner-client";
  };
};

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    setMessage("");
    setIsLoading(true);

    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const role = String(formData.get("role") ?? "");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
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
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage("Account created successfully.");
      form.reset();
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Account Type */}
      <div>
        <label htmlFor="role" className="mb-2 block text-sm font-medium">
          Account Type
        </label>

        <select
          id="role"
          name="role"
          defaultValue="owner-client"
          className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
        >
          <option value="owner-client">Property Owner</option>

          <option value="agent">Real Estate Agent</option>

          <option value="agency">Real Estate Agency</option>
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
      />

      {/* Confirm Password */}
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        autoComplete="new-password"
        required
      />

      {/* Response Message */}
      {message && <p className="text-sm text-secondary">{message}</p>}

      {/* Submit */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
