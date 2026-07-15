import { pgTable, text, boolean, primaryKey } from "drizzle-orm/pg-core";
import { business } from "./business";
import { category } from "./category";

export const businessCategory = pgTable("business_category", {
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  categoryId: text("categoryId").notNull().references(() => category.id, { onDelete: "cascade" }),
  isPrimary: boolean("isPrimary").default(false).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.businessId, table.categoryId] })
  }
});
