import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { business } from "./business";

export const emailLogs = pgTable("email_logs", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => user.id, { onDelete: "set null" }),
  businessId: text("businessId").references(() => business.id, { onDelete: "set null" }),
  recipientEmail: text("recipientEmail").notNull(),
  event: text("event").notNull(),
  status: text("status").notNull(), // 'sent' | 'failed'
  providerMessageId: text("providerMessageId"),
  error: text("error"),
  sentAt: timestamp("sentAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
