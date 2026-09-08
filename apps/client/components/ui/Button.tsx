import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  children,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:opacity-80",
    secondary: "bg-secondary text-white hover:opacity-80",
    outline: "border border-border bg-white text-foreground hover:bg-gray-50",
  };

  return (
    <button
      className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
