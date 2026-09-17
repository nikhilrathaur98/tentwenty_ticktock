import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { DotsIcon } from "@/components/ui/icons";
import type { Entry } from "@/types";

interface EntryCardProps {
  entry: Entry;
  projectName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function EntryCard({
  entry,
  projectName,
  onEdit,
  onDelete,
}: EntryCardProps) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
      <p className="w-full truncate text-base font-medium text-gray-900 sm:w-auto sm:min-w-0 sm:flex-1">
        {entry.description}
      </p>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-gray-400">{entry.hours} hrs</span>
        <span className="rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800">
          {projectName}
        </span>
        <DropdownMenu
          triggerLabel={`Actions for ${entry.description}`}
          triggerClassName="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          trigger={<DotsIcon />}
          items={[
            { label: "Edit", onClick: onEdit },
            { label: "Delete", onClick: onDelete, danger: true },
          ]}
        />
      </div>
    </li>
  );
}
