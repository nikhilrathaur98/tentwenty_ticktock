import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { inputClasses } from "@/components/ui/inputStyles";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
}

export function Select({
  options,
  placeholder,
  hasError,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={hasError || undefined}
        className={inputClasses(
          hasError,
          `h-10 appearance-none pr-10 ${className ?? ""}`,
        )}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
    </div>
  );
}
