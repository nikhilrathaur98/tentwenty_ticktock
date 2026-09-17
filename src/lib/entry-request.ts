import type { NextRequest } from "next/server";
import { getProjectsAndWorkTypes } from "@/lib/db";
import { hasErrors, validateEntry } from "@/lib/validation";
import { errorResponse } from "@/lib/api-response";
import type { EntryInput } from "@/types";

/** Reads and validates an entry from the request body. Shared by POST and PUT. */
export async function parseEntryBody(request: NextRequest) {
  const body = (await request
    .json()
    .catch(() => null)) as Partial<EntryInput> | null;
  if (!body) return { error: errorResponse("Invalid JSON body.", 400) };

  const input: Partial<EntryInput> = {
    date: body.date,
    projectId: body.projectId,
    workType: body.workType,
    description: body.description?.trim(),
    hours: body.hours,
  };

  const errors = validateEntry(input);
  const { projects, workTypes } = await getProjectsAndWorkTypes();
  if (input.projectId && !projects.some((p) => p.id === input.projectId)) {
    errors.projectId = "Selected project does not exist.";
  }
  if (input.workType && !workTypes.includes(input.workType)) {
    errors.workType = "Selected type of work does not exist.";
  }

  if (hasErrors(errors)) {
    return {
      error: errorResponse("Please fix the highlighted fields.", 422, errors),
    };
  }
  return { input: input as EntryInput };
}
