import { db } from "@/db";
import { emailLogs } from "@/db/schema";
import { randomUUID } from "crypto";

export interface RecordEmailLogParams {
  userId?: string | null;
  businessId?: string | null;
  recipientEmail: string;
  event: string;
  status: "sent" | "failed";
  providerMessageId?: string | null;
  error?: string | null;
}

/**
 * Persists an email log entry to the database.
 * Wrapped in safe try-catch so logging failures never disrupt application flow.
 */
export async function recordEmailLog(params: RecordEmailLogParams): Promise<void> {
  try {
    await db.insert(emailLogs).values({
      id: `elog_${randomUUID().replace(/-/g, "").substring(0, 16)}`,
      userId: params.userId || null,
      businessId: params.businessId || null,
      recipientEmail: params.recipientEmail,
      event: params.event,
      status: params.status,
      providerMessageId: params.providerMessageId || null,
      error: params.error || null,
      sentAt: params.status === "sent" ? new Date() : null,
      createdAt: new Date(),
    });
  } catch (logErr) {
    console.error("[Email Log Error] Failed to write email log:", logErr);
  }
}
