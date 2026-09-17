import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
}

export function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-3 text-sm text-gray-500"
    >
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary-600"
        {...props}
      />
      {label}
    </label>
  );
}
