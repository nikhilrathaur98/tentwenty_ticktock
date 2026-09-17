import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createEntry } from "@/lib/db";
import { parseEntryBody } from "@/lib/entry-request";
import { unauthorized } from "@/lib/api-response";

// POST /api/entries
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { input, error } = await parseEntryBody(request);
  if (error) return error;

  const entry = await createEntry({ ...input, userId: user.id });
  return NextResponse.json(entry, { status: 201 });
}
