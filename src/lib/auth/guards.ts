import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";

/**
 * Ensures the user is a guest (not authenticated).
 * If a valid session exists, redirects to the default authenticated route.
 * Must be called within a Server Component.
 */

export async function requireGuest() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(DEFAULT_AUTHENTICATED_REDIRECT);
  }
}
