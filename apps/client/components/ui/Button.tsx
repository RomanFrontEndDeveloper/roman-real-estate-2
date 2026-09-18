import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "default" | "icon";
};

export default function Button({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:opacity-80",
    secondary: "bg-secondary text-white hover:opacity-80",
    outline:
      "border border-border bg-white text-foreground hover:bg-gray-50",
  };

  const sizes = {
    default: "px-5 py-2.5",
    icon: "p-2",
  };

  return (
    <button
      className={`rounded-lg text-sm font-medium transition-opacity ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}