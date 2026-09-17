import { PlusIcon } from "@/components/ui/icons";
import { EntryCard } from "@/components/week/EntryCard";
import { formatShortDate } from "@/lib/dates";
import type { Entry, TimesheetDay } from "@/types";

interface DaySectionProps {
  day: TimesheetDay;
  getProjectName: (projectId: string) => string;
  onAdd: (date: string) => void;
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
}

export function DaySection({
  day,
  getProjectName,
  onAdd,
  onEdit,
  onDelete,
}: DaySectionProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-6">
      <h2 className="w-24 shrink-0 pt-2 text-lg font-semibold text-gray-900">
        {formatShortDate(day.date)}
      </h2>

      <div className="flex flex-1 flex-col gap-2.5">
        {day.entries.length > 0 && (
          <ul className="flex flex-col gap-2.5">
            {day.entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                projectName={getProjectName(entry.projectId)}
                onEdit={() => onEdit(entry)}
                onDelete={() => onDelete(entry)}
              />
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => onAdd(day.date)}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-sm font-medium text-gray-500 transition-colors hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700"
        >
          <PlusIcon />
          Add new task
        </button>
      </div>
    </div>
  );
}
