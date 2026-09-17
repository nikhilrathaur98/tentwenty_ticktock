import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProjectsAndWorkTypes } from "@/lib/db";
import { unauthorized } from "@/lib/api-response";

// GET /api/projects
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  return NextResponse.json(await getProjectsAndWorkTypes());
}
