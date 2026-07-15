import { pgTable, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";
import { category } from "./category";

export const subcategory = pgTable("subcategory", {
  id: text("id").primaryKey(),
  categoryId: text("categoryId").notNull().references(() => category.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
}, (table) => {
  return {
    categoryIdIdx: index("subcategory_category_id_idx").on(table.categoryId),
  }
});
