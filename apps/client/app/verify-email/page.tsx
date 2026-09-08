"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const hasVerified = useRef(false);

  const [message, setMessage] = useState(
    token ? "Verifying your email..." : "Verification token is missing.",
  );

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token || hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Email verification failed.");
          return;
        }

        setIsSuccess(true);
        setMessage("Email verified successfully.");
      } catch {
        setMessage("Unable to connect to the server. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-3xl font-semibold">
          {isSuccess ? "Email Verified!" : "Email Verification"}
        </h1>

        <p className="mb-6 text-secondary">{message}</p>

        {isSuccess && (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Go to Login
          </button>
        )}
      </div>
    </main>
  );
}

function VerifyEmailFallback() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-3xl font-semibold">Email Verification</h1>

        <p className="text-secondary">Verifying your email...</p>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
