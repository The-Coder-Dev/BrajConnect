import { pgTable, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";
import { business } from "./business";

export const businessServices = pgTable("business_services", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
}, (table) => {
  return {
    businessIdIdx: index("services_business_id_idx").on(table.businessId),
  }
});
