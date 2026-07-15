import { pgTable, text, timestamp, boolean, index, integer } from "drizzle-orm/pg-core";

export const amenities = pgTable("amenities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
}, (table) => {
  return {
    activeIdx: index("amenities_active_idx").on(table.active),
  }
});
