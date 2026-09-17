import type { EntryErrors, EntryInput } from "@/types";
import { getWeekForDate, isValidISODate } from "@/lib/dates";

export const MIN_HOURS = 1;
export const MAX_HOURS = 24;
export const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Validates a timesheet entry. Used by both the form (client) and the API (server),
 * so the rules are always the same. Returns an empty object when the entry is valid.
 */
export function validateEntry(input: Partial<EntryInput>): EntryErrors {
  const errors: EntryErrors = {};

  if (
    !input.date ||
    !isValidISODate(input.date) ||
    getWeekForDate(input.date) === null
  ) {
    errors.date = "Please choose a valid working day.";
  }

  if (!input.projectId) {
    errors.projectId = "Please select a project.";
  }

  if (!input.workType) {
    errors.workType = "Please select a type of work.";
  }

  const description = input.description?.trim() ?? "";
  if (!description) {
    errors.description = "Task description is required.";
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Task description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`;
  }

  const hours = input.hours;
  if (
    typeof hours !== "number" ||
    !Number.isInteger(hours) ||
    hours < MIN_HOURS ||
    hours > MAX_HOURS
  ) {
    errors.hours = `Hours must be a whole number between ${MIN_HOURS} and ${MAX_HOURS}.`;
  }

  return errors;
}

export function hasErrors(errors: EntryErrors): boolean {
  return Object.keys(errors).length > 0;
}
