import { pgTable, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";

export const category = pgTable("category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  description: text("description"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
}, (table) => {
  return {
    activeIdx: index("category_active_idx").on(table.active),
    sortOrderIdx: index("category_sort_order_idx").on(table.sortOrder),
  }
});
