"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

type DeletePropertyButtonProps = {
  propertyId: string;
};

export default function DeletePropertyButton({
  propertyId,
}: DeletePropertyButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setIsDeleting(true);

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        setMessage("Authentication required.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete property.");
        return;
      }

      router.push("/property");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>

      {message && <p className="mt-2 text-sm text-secondary">{message}</p>}
    </div>
  );
}
