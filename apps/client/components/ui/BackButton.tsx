"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button type="button" onClick={() => router.back()}>
      ← Back
    </Button>
  );
}
