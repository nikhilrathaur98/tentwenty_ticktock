"use client";

import { useApi } from "@/hooks/useApi";
import type { PaginatedResponse, Timesheet, TimesheetQuery } from "@/types";

export function buildTimesheetsUrl(query: TimesheetQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
    sortBy: query.sortBy,
    order: query.order,
  });
  if (query.status) params.set("status", query.status);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  return `/api/timesheets?${params.toString()}`;
}

export function useTimesheets(query: TimesheetQuery) {
  return useApi<PaginatedResponse<Timesheet>>(buildTimesheetsUrl(query));
}
