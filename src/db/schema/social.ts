import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { business } from "./business";

export const social = pgTable("social", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(), // e.g., 'facebook', 'twitter', 'instagram'
  url: text("url").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
