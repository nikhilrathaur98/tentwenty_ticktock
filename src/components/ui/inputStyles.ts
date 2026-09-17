import { cn } from "@/lib/cn";

/** Shared look for Input, Select and Textarea. */
export function inputClasses(hasError?: boolean, className?: string) {
  return cn(
    "w-full rounded-lg border bg-white px-4 text-sm text-gray-900 placeholder:text-gray-500",
    "focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100",
    hasError
      ? "border-danger-600 focus:ring-red-200"
      : "border-gray-300 focus:border-primary-600 focus:ring-primary-100",
    className,
  );
}
