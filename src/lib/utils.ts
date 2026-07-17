import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFriendlyErrorMessage(error: any, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const msg = String(error.message);
    const isDbError = /select|insert|update|delete|relation|column|foreign\s*key|unique|constraint|sql|query|postgres/i.test(msg);
    if (!isDbError) {
      return msg;
    }
  }
  if (typeof error === "string") {
    const isDbError = /select|insert|update|delete|relation|column|foreign\s*key|unique|constraint|sql|query|postgres/i.test(error);
    if (!isDbError) {
      return error;
    }
  }
  return fallback;
}

