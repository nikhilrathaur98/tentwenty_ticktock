import { describe, expect, it } from "vitest";
import {
  buildTimesheets,
  filterTimesheets,
  getStatus,
  paginate,
  sortTimesheets,
} from "@/lib/timesheets";
import type { Entry } from "@/types";

function entry(date: string, hours: number): Entry {
  return {
    id: date + hours,
    userId: "u1",
    date,
    projectId: "p1",
    workType: "Bug fixes",
    description: "Work",
    hours,
  };
}

describe("getStatus", () => {
  it("follows the status rules", () => {
    expect(getStatus(0)).toBe("missing");
    expect(getStatus(20)).toBe("incomplete");
    expect(getStatus(40)).toBe("completed");
  });
});

describe("buildTimesheets", () => {
  it("adds up hours per week", () => {
    const timesheets = buildTimesheets([
      entry("2024-01-01", 8),
      entry("2024-01-02", 8),
      entry("2024-01-08", 40),
    ]);
    expect(timesheets).toHaveLength(52);
    expect(timesheets[0]).toMatchObject({
      week: 1,
      totalHours: 16,
      status: "incomplete",
    });
    expect(timesheets[1]).toMatchObject({
      week: 2,
      totalHours: 40,
      status: "completed",
    });
    expect(timesheets[2]).toMatchObject({
      week: 3,
      totalHours: 0,
      status: "missing",
    });
  });
});

describe("filterTimesheets", () => {
  const timesheets = buildTimesheets([entry("2024-01-01", 40)]);

  it("returns every week the date range touches", () => {
    const result = filterTimesheets(timesheets, {
      from: "2024-01-03",
      to: "2024-01-16",
    });
    expect(result.map((t) => t.week)).toEqual([1, 2, 3]);
  });

  it("filters by status", () => {
    const result = filterTimesheets(timesheets, { status: "completed" });
    expect(result.map((t) => t.week)).toEqual([1]);
  });
});

describe("sortTimesheets", () => {
  it("sorts by week descending", () => {
    const sorted = sortTimesheets(buildTimesheets([]), {
      sortBy: "week",
      order: "desc",
    });
    expect(sorted[0].week).toBe(52);
  });
});

describe("paginate", () => {
  it("returns the requested page and meta", () => {
    const result = paginate([1, 2, 3, 4, 5, 6, 7], 2, 5);
    expect(result.data).toEqual([6, 7]);
    expect(result.meta).toEqual({ page: 2, limit: 5, total: 7, totalPages: 2 });
  });
});
