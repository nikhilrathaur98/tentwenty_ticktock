"use client";

import { useState } from "react";
import { DateRangeFilter } from "@/components/timesheets/DateRangeFilter";
import { TimesheetTable } from "@/components/timesheets/TimesheetTable";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { useTimesheets } from "@/hooks/useTimesheets";
import type { SortField, TimesheetQuery, TimesheetStatus } from "@/types";

const statusOptions = [
  { value: "completed", label: "Completed" },
  { value: "incomplete", label: "Incomplete" },
  { value: "missing", label: "Missing" },
];

const perPageOptions = [5, 10, 20].map((n) => ({
  value: String(n),
  label: `${n} per page`,
}));

export function TimesheetList() {
  const [query, setQuery] = useState<TimesheetQuery>({
    page: 1,
    limit: 5,
    sortBy: "week",
    order: "asc",
  });
  const { data, error, isLoading, refetch } = useTimesheets(query);

  // Any filter change sends the user back to page 1.
  function updateFilters(changes: Partial<TimesheetQuery>) {
    setQuery((current) => ({ ...current, ...changes, page: 1 }));
  }

  function handleSort(field: SortField) {
    setQuery((current) => ({
      ...current,
      sortBy: field,
      order:
        current.sortBy === field && current.order === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Timesheets</h1>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <DateRangeFilter
          from={query.from}
          to={query.to}
          onChange={(range) =>
            updateFilters({ from: range.from, to: range.to })
          }
        />
        <div className="sm:w-40">
          <Select
            aria-label="Filter by status"
            className="h-12"
            placeholder="Status"
            options={statusOptions}
            value={query.status ?? ""}
            onChange={(e) =>
              updateFilters({
                status: (e.target.value || undefined) as
                  | TimesheetStatus
                  | undefined,
              })
            }
          />
        </div>
      </div>

      <TimesheetTable
        timesheets={data?.data ?? []}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        sortBy={query.sortBy}
        order={query.order}
        onSort={handleSort}
      />

      {data && (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="w-36">
            <Select
              aria-label="Rows per page"
              options={perPageOptions}
              value={String(query.limit)}
              onChange={(e) => updateFilters({ limit: Number(e.target.value) })}
            />
          </div>
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={(page) =>
              setQuery((current) => ({ ...current, page }))
            }
          />
        </div>
      )}
    </section>
  );
}
