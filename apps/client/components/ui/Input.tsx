import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary"
      {...props}
    />
  );
}
