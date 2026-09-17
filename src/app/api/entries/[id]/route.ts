import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteEntry, getEntryById, updateEntry } from "@/lib/db";
import { parseEntryBody } from "@/lib/entry-request";
import { notFound, unauthorized } from "@/lib/api-response";

type Context = RouteContext<"/api/entries/[id]">;

/** Finds an entry that belongs to the logged-in user. */
async function findOwnEntry(ctx: Context, userId: string) {
  const { id } = await ctx.params;
  const entry = await getEntryById(id);
  return entry && entry.userId === userId ? entry : null;
}

// PUT /api/entries/:id
export async function PUT(request: NextRequest, ctx: Context) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const entry = await findOwnEntry(ctx, user.id);
  if (!entry) return notFound("Entry");

  const { input, error } = await parseEntryBody(request);
  if (error) return error;

  const updated = await updateEntry(entry.id, input);
  return NextResponse.json(updated);
}

// DELETE /api/entries/:id
export async function DELETE(_request: NextRequest, ctx: Context) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const entry = await findOwnEntry(ctx, user.id);
  if (!entry) return notFound("Entry");

  await deleteEntry(entry.id);
  return NextResponse.json({ success: true });
}
