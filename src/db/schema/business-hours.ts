import { pgTable, text, boolean, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { business } from "./business";

export const businessHours = pgTable("business_hours", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  dayOfWeek: integer("dayOfWeek").notNull(), // 0 = Sunday, 1 = Monday, etc.
  openTime: text("openTime"), // e.g. "09:00"
  closeTime: text("closeTime"), // e.g. "18:00"
  isClosed: boolean("isClosed").default(false).notNull(),
  is24Hours: boolean("is24Hours").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    businessDayUnique: unique("business_day_unique").on(table.businessId, table.dayOfWeek),
    businessIdIdx: index("hours_business_id_idx").on(table.businessId),
  }
});
