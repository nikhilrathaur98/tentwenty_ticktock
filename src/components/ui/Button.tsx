import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-700 text-white hover:bg-primary-800 focus-visible:ring-primary-100",
  secondary:
    "border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-100",
  danger:
    "bg-danger-600 text-white hover:bg-red-700 focus-visible:ring-red-100",
};

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
