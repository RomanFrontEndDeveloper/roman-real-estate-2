"use client";

import Button from "./Button";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
  loadingText?: string;
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  isLoading = false,
  confirmText = "Confirm",
  loadingText = "Processing...",
}: ConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-serif text-2xl text-primary">{title}</h2>

        <p className="mt-3 text-secondary">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? loadingText : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
