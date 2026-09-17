import type { TimesheetStatus } from "@/types";
import { cn } from "@/lib/cn";

const styles: Record<TimesheetStatus, string> = {
  completed: "bg-success-100 text-success-800",
  incomplete: "bg-warning-100 text-warning-800",
  missing: "bg-danger-100 text-danger-800",
};

export function StatusBadge({ status }: { status: TimesheetStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2.5 py-0.5 text-xs font-medium uppercase",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
