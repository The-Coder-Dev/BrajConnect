import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";

/**
 * Cached session lookup — deduped across all callers within the same React
 * render tree (layout + page + server actions all share one DB round-trip).
 */
export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

/**
 * Ensures the user is a guest (not authenticated).
 * If a valid session exists, redirects to the default authenticated route.
 * Must be called within a Server Component or Server Action.
 */
export async function requireGuest() {
  const session = await getSession();

  if (session) {
    redirect(DEFAULT_AUTHENTICATED_REDIRECT);
  }
}

/**
 * Ensures the user is authenticated.
 * If no valid session exists, redirects to the sign-in page.
 * Returns the session and user if authenticated.
 * Must be called within a Server Component or Server Action.
 *
 * Because getSession() is wrapped in React cache(), calling requireAuth()
 * multiple times in the same request (e.g. layout + page) does NOT issue
 * duplicate database queries — the result is memoized for the lifetime of
 * the current request.
 */
export async function requireAuth() {
  const sessionData = await getSession();

  if (!sessionData || !sessionData.session) {
    redirect("/sign-in");
  }

  return sessionData;
}
