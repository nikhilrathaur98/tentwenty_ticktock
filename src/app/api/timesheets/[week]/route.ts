import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getEntriesForUser } from "@/lib/db";
import { isValidWeek } from "@/lib/dates";
import { buildWeekTimesheet } from "@/lib/timesheets";
import { notFound, unauthorized } from "@/lib/api-response";

// GET /api/timesheets/3
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/timesheets/[week]">,
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { week } = await ctx.params;
  const weekNumber = Number(week);
  if (!isValidWeek(weekNumber)) return notFound("Week");

  const entries = await getEntriesForUser(user.id);
  return NextResponse.json(buildWeekTimesheet(weekNumber, entries));
}
