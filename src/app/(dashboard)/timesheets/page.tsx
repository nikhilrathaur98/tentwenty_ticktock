import type { Metadata } from "next";
import { TimesheetList } from "@/components/timesheets/TimesheetList";

export const metadata: Metadata = { title: "Timesheets | ticktock" };

export default function TimesheetsPage() {
  return <TimesheetList />;
}
