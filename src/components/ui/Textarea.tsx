import type { TextareaHTMLAttributes } from "react";
import { inputClasses } from "@/components/ui/inputStyles";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({ hasError, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={hasError || undefined}
      className={inputClasses(
        hasError,
        `min-h-32 resize-y py-3 ${className ?? ""}`,
      )}
      {...props}
    />
  );
}
