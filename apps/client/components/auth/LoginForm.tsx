"use client";

import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

type LoginResponse = {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "agency" | "agent" | "owner-client";
  };
};

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget; // Зберігаємо форму, тому що далі буде await.

    setMessage("");
    setIsLoading(true);

    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      setMessage("Login successful.");
      form.reset();
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        autoComplete="current-password"
        required
      />

      {/* Response Message */}
      {message && <p className="text-sm text-secondary">{message}</p>}

      {/* Submit */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Logging In..." : "Login"}
      </Button>
    </form>
  );
}
