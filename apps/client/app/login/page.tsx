import Link from "next/link";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Welcome Back
          </p>

          <h1 className="mt-3 font-serif text-4xl">
            Login to Roman Real Estate
          </h1>

          <p className="mt-3 text-secondary">
            Sign in to manage your account and properties.
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
