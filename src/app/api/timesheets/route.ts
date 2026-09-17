import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getEntriesForUser } from "@/lib/db";
import { isValidISODate } from "@/lib/dates";
import { errorResponse, unauthorized } from "@/lib/api-response";
import {
  buildTimesheets,
  filterTimesheets,
  paginate,
  sortTimesheets,
  TIMESHEET_STATUSES,
} from "@/lib/timesheets";
import type { SortField, SortOrder, TimesheetStatus } from "@/types";

const ALLOWED_LIMITS = [5, 10, 20];

// GET /api/timesheets?page=1&limit=5&status=completed&from=2024-01-01&to=2024-01-31&sortBy=week&order=asc
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") ?? 1);
  const limit = Number(params.get("limit") ?? 5);
  const status = params.get("status") || undefined;
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;
  const sortBy = (params.get("sortBy") ?? "week") as SortField;
  const order = (params.get("order") ?? "asc") as SortOrder;

  if (!Number.isInteger(page) || page < 1)
    return errorResponse("Invalid page.", 400);
  if (!ALLOWED_LIMITS.includes(limit))
    return errorResponse("Invalid limit.", 400);
  if (status && !TIMESHEET_STATUSES.includes(status as TimesheetStatus)) {
    return errorResponse("Invalid status.", 400);
  }
  if ((from && !isValidISODate(from)) || (to && !isValidISODate(to))) {
    return errorResponse("Invalid date range.", 400);
  }
  if (from && to && from > to)
    return errorResponse("Start date must be before end date.", 400);
  if (
    !["week", "status"].includes(sortBy) ||
    !["asc", "desc"].includes(order)
  ) {
    return errorResponse("Invalid sort.", 400);
  }

  const entries = await getEntriesForUser(user.id);
  const filtered = filterTimesheets(buildTimesheets(entries), {
    status: status as TimesheetStatus | undefined,
    from,
    to,
  });
  const sorted = sortTimesheets(filtered, { sortBy, order });

  return NextResponse.json(paginate(sorted, page, limit));
}
