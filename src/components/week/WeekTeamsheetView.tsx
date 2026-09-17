"use client";

import { useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { DaySection } from "@/components/week/DaySection";
import { DeleteEntryDialog } from "@/components/week/DeleteEntryDialog";
import { EntryModal } from "@/components/week/EntryModal";
import { useProjects, useWeekTimesheet } from "@/hooks/useWeekTimesheet";
import { formatDateRange, HOURS_PER_WEEK } from "@/lib/dates";
import type { Entry } from "@/types";

type ModalState =
  | { type: "closed" }
  | { type: "add"; date: string }
  | { type: "edit"; entry: Entry }
  | { type: "delete"; entry: Entry };

export function WeekTimesheetView({ week }: { week: number }) {
  const timesheet = useWeekTimesheet(week);
  const projects = useProjects();
  const [modal, setModal] = useState<ModalState>({ type: "closed" });

  const closeModal = () => setModal({ type: "closed" });
  const getProjectName = (id: string) =>
    projects.data?.projects.find((p) => p.id === id)?.name ?? "Unknown project";

  const data = timesheet.data;
  const error = timesheet.error ?? projects.error;

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <Link
        href="/timesheets"
        className="mb-4 inline-block text-sm text-primary-600 hover:underline"
      >
        ← Back to timesheets
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            This week&apos;s timesheet
          </h1>
          {data && (
            <p className="mt-4 text-sm text-gray-500">
              {formatDateRange(data.startDate, data.endDate)}
            </p>
          )}
        </div>
        {data && <ProgressBar value={data.totalHours} max={HOURS_PER_WEEK} />}
      </div>

      {error && (
        <StatusMessage
          isError
          message={error}
          onRetry={() => {
            timesheet.refetch();
            projects.refetch();
          }}
        />
      )}

      {!error && (!data || !projects.data) && (
        <StatusMessage message="Loading timesheet..." />
      )}

      {!error && data && projects.data && (
        <div className="flex flex-col gap-6">
          {data.days.map((day) => (
            <DaySection
              key={day.date}
              day={day}
              getProjectName={getProjectName}
              onAdd={(date) => setModal({ type: "add", date })}
              onEdit={(entry) => setModal({ type: "edit", entry })}
              onDelete={(entry) => setModal({ type: "delete", entry })}
            />
          ))}
        </div>
      )}

      {projects.data && (modal.type === "add" || modal.type === "edit") && (
        <EntryModal
          date={modal.type === "add" ? modal.date : modal.entry.date}
          entry={modal.type === "edit" ? modal.entry : undefined}
          options={projects.data}
          onClose={closeModal}
          onSaved={timesheet.refetch}
        />
      )}

      {modal.type === "delete" && (
        <DeleteEntryDialog
          entry={modal.entry}
          onClose={closeModal}
          onDeleted={timesheet.refetch}
        />
      )}
    </section>
  );
}
