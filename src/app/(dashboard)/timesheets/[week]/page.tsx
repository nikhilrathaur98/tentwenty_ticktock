import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeekTimesheetView } from "@/components/week/WeekTeamsheetView";
import { isValidWeek } from "@/lib/dates";

export const metadata: Metadata = { title: "Week timesheet | ticktock" };

export default async function WeekTimesheetPage({
  params,
}: PageProps<"/timesheets/[week]">) {
  const { week } = await params;
  const weekNumber = Number(week);
  if (!isValidWeek(weekNumber)) notFound();

  return <WeekTimesheetView week={weekNumber} />;
}
