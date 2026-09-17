import Link from "next/link";
import { StatusBadge } from "@/components/timesheets/StatusBadge";
import { ArrowDownIcon } from "@/components/ui/icons";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { formatDateRange } from "@/lib/dates";
import { cn } from "@/lib/cn";
import type { SortField, SortOrder, Timesheet, TimesheetStatus } from "@/types";

const actionLabels: Record<TimesheetStatus, string> = {
  completed: "View",
  incomplete: "Update",
  missing: "Create",
};

interface TimesheetTableProps {
  timesheets: Timesheet[];
  isLoading: boolean;
  error?: string;
  onRetry: () => void;
  sortBy: SortField;
  order: SortOrder;
  onSort: (field: SortField) => void;
}

function SortButton({
  label,
  field,
  sortBy,
  order,
  onSort,
}: { label: string; field: SortField } & Pick<
  TimesheetTableProps,
  "sortBy" | "order" | "onSort"
>) {
  const isActive = sortBy === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-2 uppercase hover:text-gray-900"
    >
      {label}
      <ArrowDownIcon
        width={14}
        height={14}
        className={cn(
          "transition-transform",
          isActive && order === "desc" && "rotate-180",
          !isActive && "opacity-40",
        )}
      />
    </button>
  );
}

export function TimesheetTable({
  timesheets,
  isLoading,
  error,
  onRetry,
  sortBy,
  order,
  onSort,
}: TimesheetTableProps) {
  const sortProps = { sortBy, order, onSort };

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-gray-50 text-xs font-medium text-gray-500">
          <tr>
            <th scope="col" className="w-28 px-3 py-4">
              <SortButton label="Week #" field="week" {...sortProps} />
            </th>
            <th scope="col" className="px-6 py-4">
              <SortButton label="Date" field="week" {...sortProps} />
            </th>
            <th scope="col" className="px-6 py-4">
              <SortButton label="Status" field="status" {...sortProps} />
            </th>
            <th scope="col" className="px-6 py-4 text-right uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={cn(isLoading && "opacity-50")}>
          {timesheets.map((timesheet) => (
            <tr
              key={timesheet.week}
              className="border-t border-gray-200 bg-white"
            >
              <td className="bg-gray-50 px-3 py-5 text-gray-900">
                {timesheet.week}
              </td>
              <td className="px-6 py-5 text-gray-500">
                {formatDateRange(timesheet.startDate, timesheet.endDate)}
              </td>
              <td className="px-6 py-5">
                <StatusBadge status={timesheet.status} />
              </td>
              <td className="px-6 py-5 text-right">
                <Link
                  href={`/timesheets/${timesheet.week}`}
                  className="text-primary-600 hover:underline"
                >
                  {actionLabels[timesheet.status]}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <StatusMessage isError message={error} onRetry={onRetry} />}
      {!error && !isLoading && timesheets.length === 0 && (
        <StatusMessage message="No timesheets match your filters." />
      )}
      {isLoading && timesheets.length === 0 && (
        <StatusMessage message="Loading timesheets..." />
      )}
    </div>
  );
}
