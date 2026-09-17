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
      startDate: "2024-01-01",
      endDate: "2024-01-05",
    });
    expect(getWeekRange(5)).toEqual({
      startDate: "2024-01-29",
      endDate: "2024-02-02",
    });
  });

  it("formats ranges in the same month and across months", () => {
    expect(formatDateRange("2024-01-01", "2024-01-05")).toBe(
      "1 - 5 January, 2024",
    );
    expect(formatDateRange("2024-01-29", "2024-02-02")).toBe(
      "29 January - 2 February, 2024",
    );
  });

  it("formats a short date", () => {
    expect(formatShortDate("2024-01-21")).toBe("Jan 21");
  });

  it("finds the week of a working day", () => {
    expect(getWeekForDate("2024-01-03")).toBe(1);
    expect(getWeekForDate("2024-01-06")).toBeNull(); // Saturday
  });

  it("validates ISO dates", () => {
    expect(isValidISODate("2024-02-29")).toBe(true);
    expect(isValidISODate("2024-02-30")).toBe(false);
    expect(isValidISODate("hello")).toBe(false);
  });
});
