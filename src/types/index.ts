export type TimesheetStatus = "completed" | "incomplete" | "missing";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Entry {
  id: string;
  userId: string;
  date: string; // "YYYY-MM-DD"
  projectId: string;
  workType: string;
  description: string;
  hours: number;
}

export interface Database {
  users: User[];
  projects: Project[];
  workTypes: string[];
  entries: Entry[];
}

export interface Timesheet {
  week: number;
  startDate: string;
  endDate: string;
  totalHours: number;
  status: TimesheetStatus;
}

export interface TimesheetDay {
  date: string;
  entries: Entry[];
}

export interface WeekTimesheet extends Timesheet {
  days: TimesheetDay[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type SortField = "week" | "status";
export type SortOrder = "asc" | "desc";

export interface TimesheetQuery {
  page: number;
  limit: number;
  status?: TimesheetStatus;
  from?: string;
  to?: string;
  sortBy: SortField;
  order: SortOrder;
}

export interface EntryInput {
  date: string;
  projectId: string;
  workType: string;
  description: string;
  hours: number;
}

export type EntryErrors = Partial<Record<keyof EntryInput, string>>;

export interface ProjectsResponse {
  projects: Project[];
  workTypes: string[];
}
