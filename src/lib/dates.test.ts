import { describe, expect, it } from "vitest";
import {
  formatDateRange,
  formatShortDate,
  getWeekForDate,
  getWeekRange,
  isValidISODate,
} from "@/lib/dates";

describe("dates", () => {
  it("returns Monday to Friday for a week", () => {
    expect(getWeekRange(1)).toEqual({
      startDate: "2025-12-29",
      endDate: "2026-01-02",
    });
    expect(getWeekRange(5)).toEqual({
      startDate: "2026-01-26",
      endDate: "2026-01-30",
    });
  });

  it("formats ranges in the same month, across months, and across years", () => {
    expect(formatDateRange("2026-01-26", "2026-01-30")).toBe(
      "26 - 30 January, 2026",
    );
    expect(formatDateRange("2026-01-29", "2026-02-02")).toBe(
      "29 January - 2 February, 2026",
    );
    expect(formatDateRange("2025-12-29", "2026-01-02")).toBe(
      "29 December, 2025 - 2 January, 2026",
    );
  });

  it("formats a short date", () => {
    expect(formatShortDate("2026-01-21")).toBe("Jan 21");
  });

  it("finds the week of a working day", () => {
    expect(getWeekForDate("2025-12-31")).toBe(1);
    expect(getWeekForDate("2026-01-03")).toBeNull(); // Saturday
  });

  it("validates ISO dates", () => {
    expect(isValidISODate("2024-02-29")).toBe(true);
    expect(isValidISODate("2024-02-30")).toBe(false);
    expect(isValidISODate("hello")).toBe(false);
  });
});
