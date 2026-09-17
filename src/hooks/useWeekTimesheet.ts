"use client";

import { useApi } from "@/hooks/useApi";
import type { ProjectsResponse, WeekTimesheet } from "@/types";

export function useWeekTimesheet(week: number) {
  return useApi<WeekTimesheet>(`/api/timesheets/${week}`);
}

export function useProjects() {
  return useApi<ProjectsResponse>("/api/projects");
}
