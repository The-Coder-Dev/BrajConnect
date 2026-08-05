import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { business } from "./business";
import { user } from "./auth";

export const activityLogs = pgTable("activity_logs", {
  id: text("id").primaryKey(),
  businessId: text("businessId").references(() => business.id, { onDelete: "cascade" }),
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});
