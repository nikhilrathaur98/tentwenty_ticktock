import type { InputHTMLAttributes } from "react";
import { inputClasses } from "@/components/ui/inputStyles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={hasError || undefined}
      className={inputClasses(hasError, `h-12 ${className ?? ""}`)}
      {...props}
    />
  );
}
