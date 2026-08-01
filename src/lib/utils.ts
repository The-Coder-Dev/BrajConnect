import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getFriendlyErrorMessage(error: any, fallback: string): string {
  if (!error) return fallback;

  const msg = typeof error === "string" ? error : error?.message ? String(error.message) : "";

  if (!msg) return fallback;

  // Patterns indicating internal system, database, runtime, stack trace, or path leaks
  const isInternalLeak =
    /typeerror|referenceerror|syntaxerror|rangeerror|evalerror|urierror|at\s+[\w\.\/]+|\/node_modules\/|file:\/\/\/|select|insert|update|delete|relation|column|foreign\s*key|unique|constraint|sql|query|postgres|econnrefused|etimedout/i.test(
      msg
    );

  if (isInternalLeak) {
    return fallback;
  }

  return msg;
}

