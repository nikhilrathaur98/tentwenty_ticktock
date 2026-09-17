// All dates are stored as "YYYY-MM-DD" strings and calculated in UTC,
// so the result is the same in every timezone.

export const TOTAL_WEEKS = 52;
export const WORK_DAYS_PER_WEEK = 5;
export const HOURS_PER_WEEK = 40;
const FIRST_MONDAY = "2024-01-01";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseISODate(value);
  return !Number.isNaN(date.getTime()) && toISODate(date) === value;
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toISODate(date);
}

export function isValidWeek(week: number): boolean {
  return Number.isInteger(week) && week >= 1 && week <= TOTAL_WEEKS;
}

/** Monday of the given week number (week 1 starts on 1 January 2024). */
export function getWeekStart(week: number): string {
  return addDays(FIRST_MONDAY, (week - 1) * 7);
}

/** Monday to Friday of the given week. */
export function getWeekDays(week: number): string[] {
  const start = getWeekStart(week);
  return Array.from({ length: WORK_DAYS_PER_WEEK }, (_, i) =>
    addDays(start, i),
  );
}

export function getWeekRange(week: number): {
  startDate: string;
  endDate: string;
} {
  const days = getWeekDays(week);
  return { startDate: days[0], endDate: days[days.length - 1] };
}

/** Returns the week number a working day belongs to, or null if it is outside the timesheet weeks. */
export function getWeekForDate(iso: string): number | null {
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    if (getWeekDays(week).includes(iso)) return week;
  }
  return null;
}

/** "1 - 5 January, 2024" or "29 January - 2 February, 2024" */
export function formatDateRange(startIso: string, endIso: string): string {
  const start = parseISODate(startIso);
  const end = parseISODate(endIso);
  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  const startMonth = MONTHS[start.getUTCMonth()];
  const endMonth = MONTHS[end.getUTCMonth()];

  if (start.getUTCFullYear() !== end.getUTCFullYear()) {
    return `${startDay} ${startMonth}, ${start.getUTCFullYear()} - ${endDay} ${endMonth}, ${end.getUTCFullYear()}`;
  }
  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${endMonth}, ${end.getUTCFullYear()}`;
  }
  return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${end.getUTCFullYear()}`;
}

/** "Jan 21" */
export function formatShortDate(iso: string): string {
  const date = parseISODate(iso);
  return `${MONTHS[date.getUTCMonth()].slice(0, 3)} ${date.getUTCDate()}`;
}
