import { Resend } from "resend";

let resendClient: Resend | null = null;

/**
 * Server-only Resend Client Singleton.
 * Ensures the API key is never exposed to client-side code.
 */
export function getResendClient(): Resend | null {
  if (typeof window !== "undefined") {
    throw new Error("Resend client can only be instantiated in server-side execution.");
  }

  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    if (process.env.NODE_ENV === "production") {
      console.error("[Resend Error] Missing RESEND_API_KEY environment variable in production.");
    } else {
      console.warn("[Resend Warning] Missing RESEND_API_KEY in development mode. Email delivery skipped.");
    }
    return null;
  }

  try {
    resendClient = new Resend(apiKey);
    return resendClient;
  } catch (error) {
    console.error("[Resend Error] Failed to instantiate Resend client:", error);
    return null;
  }
}

/**
 * Verified sender address for BachatLal notifications.
 */
export function getEmailSender(): string {
  return process.env.EMAIL_FROM || "BachatLal <notifications@bachatlal.in>";
}

/**
 * Canonical public application URL for link generation.
 */
export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    "https://bachatlal.in"
  ).replace(/\/+$/, "");
}
