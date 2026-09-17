import type { ReactNode } from "react";
import { InfoIcon } from "@/components/ui/icons";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  info?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

/** Label + input + hint/error message. Wrap any input with it. */
export function FormField({
  id,
  label,
  required,
  info,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-900"
      >
        {label}
        {required && <span aria-hidden="true">*</span>}
        {info && (
          <span title={info} className="text-gray-400">
            <InfoIcon width={14} height={14} />
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}
