import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { business } from "./business";

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  businessId: text("businessId").references(() => business.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // e.g. "business_approved", "business_rejected", "lead_received", "review_received", "verification_reminder", "platform_announcement"
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
