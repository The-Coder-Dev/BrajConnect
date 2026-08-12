import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { business } from "./business";
import { category } from "./category";

export const businessCategoryDetails = pgTable("business_category_details", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().unique().references(() => business.id, { onDelete: "cascade" }),
  categoryId: text("categoryId").notNull().references(() => category.id, { onDelete: "cascade" }),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    businessIdIdx: index("biz_cat_details_biz_id_idx").on(table.businessId),
    categoryIdIdx: index("biz_cat_details_cat_id_idx").on(table.categoryId),
  };
});
