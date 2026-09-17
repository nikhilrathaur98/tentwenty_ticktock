import type {
  Entry,
  PaginatedResponse,
  Timesheet,
  TimesheetQuery,
  TimesheetStatus,
  WeekTimesheet,
} from "@/types";
import {
  getWeekDays,
  getWeekRange,
  HOURS_PER_WEEK,
  TOTAL_WEEKS,
} from "@/lib/dates";

export const TIMESHEET_STATUSES: TimesheetStatus[] = [
  "completed",
  "incomplete",
  "missing",
];

/**
 * completed  = 40 hours added
 * incomplete = less than 40 hours added
 * missing    = no hours added
 */
export function getStatus(totalHours: number): TimesheetStatus {
  if (totalHours <= 0) return "missing";
  if (totalHours >= HOURS_PER_WEEK) return "completed";
  return "incomplete";
}

function sumHours(entries: Entry[]): number {
  return entries.reduce((total, entry) => total + entry.hours, 0);
}

/** Builds one timesheet row per week from a user's entries. */
export function buildTimesheets(entries: Entry[]): Timesheet[] {
  return Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const week = i + 1;
    const { startDate, endDate } = getWeekRange(week);
    const weekEntries = entries.filter(
      (e) => e.date >= startDate && e.date <= endDate,
    );
    const totalHours = sumHours(weekEntries);
    return {
      week,
      startDate,
      endDate,
      totalHours,
      status: getStatus(totalHours),
    };
  });
}

export function buildWeekTimesheet(
  week: number,
  entries: Entry[],
): WeekTimesheet {
  const { startDate, endDate } = getWeekRange(week);
  const days = getWeekDays(week).map((date) => ({
    date,
    entries: entries.filter((e) => e.date === date),
  }));
  const totalHours = sumHours(days.flatMap((d) => d.entries));
  return {
    week,
    startDate,
    endDate,
    totalHours,
    status: getStatus(totalHours),
    days,
  };
}

/**
 * Keeps timesheets that match the status and overlap the date range.
 * A range that covers several weeks returns all of those weeks.
 */
export function filterTimesheets(
  timesheets: Timesheet[],
  { status, from, to }: Pick<TimesheetQuery, "status" | "from" | "to">,
): Timesheet[] {
  return timesheets.filter((t) => {
    if (status && t.status !== status) return false;
    if (from && t.endDate < from) return false;
    if (to && t.startDate > to) return false;
    return true;
  });
}

export function sortTimesheets(
  timesheets: Timesheet[],
  { sortBy, order }: Pick<TimesheetQuery, "sortBy" | "order">,
): Timesheet[] {
  const direction = order === "asc" ? 1 : -1;
  return [...timesheets].sort((a, b) => {
    if (sortBy === "status") {
      const diff =
        TIMESHEET_STATUSES.indexOf(a.status) -
        TIMESHEET_STATUSES.indexOf(b.status);
      if (diff !== 0) return diff * direction;
    }
    return (a.week - b.week) * direction;
  });
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page: safePage, limit, total: items.length, totalPages },
  };
}
