// Small wrapper around fetch used by the browser to call our internal API routes.
import { signIn } from "next-auth/react";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const body = await response.json().catch(() => null);

  if (response.status === 401) {
    // Session expired: send the user back to the login page.
    signIn();
  }

  if (!response.ok) {
    throw new ApiError(
      body?.error ?? "Something went wrong. Please try again.",
      response.status,
      body?.details,
    );
  }

  return body as T;
}
