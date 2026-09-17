import { describe, expect, it } from "vitest";
import { validateEntry } from "@/lib/validation";

const validEntry = {
  date: "2024-01-02",
  projectId: "p1",
  workType: "Bug fixes",
  description: "Fix login bug",
  hours: 4,
};

describe("validateEntry", () => {
  it("accepts a valid entry", () => {
    expect(validateEntry(validEntry)).toEqual({});
  });

  it("requires all fields", () => {
    const errors = validateEntry({});
    expect(Object.keys(errors).sort()).toEqual([
      "date",
      "description",
      "hours",
      "projectId",
      "workType",
    ]);
  });

  it("rejects hours outside 1 to 24", () => {
    expect(validateEntry({ ...validEntry, hours: 0 }).hours).toBeDefined();
    expect(validateEntry({ ...validEntry, hours: 25 }).hours).toBeDefined();
  });

  it("rejects a description with only spaces", () => {
    expect(
      validateEntry({ ...validEntry, description: "   " }).description,
    ).toBeDefined();
  });
});
