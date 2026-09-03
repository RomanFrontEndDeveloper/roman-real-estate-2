import Link from "next/link";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-secondary">
            Welcome Back
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            Login to Roman Real Estate
          </h1>

          <p className="mt-4 text-secondary">
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
    </section>
  );
}
