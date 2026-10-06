"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/apiFetch";

import Button from "../ui/Button";
import ConfirmModal from "../ui/ConfirmModal";

type DeletePropertyButtonProps = {
  propertyId: string;
};

export default function DeletePropertyButton({
  propertyId,
}: DeletePropertyButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    setMessage("");
    setIsDeleting(true);

    try {
      const response = await apiFetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete property.");
        return;
      }

      router.refresh();
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <Button
        variant="outline"
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
        className="w-full sm:w-auto"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>

      {message && <p className="mt-2 text-sm text-secondary">{message}</p>}

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        confirmText="Delete"
      />
    </div>
  );
}
