import { NextResponse } from "next/server";

export function errorResponse(
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json({ error: message, details }, { status });
}

export const unauthorized = () => errorResponse("You must be signed in.", 401);
export const notFound = (what = "Resource") =>
  errorResponse(`${what} not found.`, 404);
