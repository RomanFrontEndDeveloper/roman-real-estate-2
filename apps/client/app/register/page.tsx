import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Create Account
          </p>

          <h1 className="mt-3 font-serif text-4xl">Join Roman Real Estate</h1>

          <p className="mt-3 text-secondary">
            Create an account to discover and manage properties.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
