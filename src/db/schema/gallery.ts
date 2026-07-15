import { pgTable, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";
import { business } from "./business";

export const gallery = pgTable("gallery", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  imageUrl: text("imageUrl").notNull(),
  cloudinaryPublicId: text("cloudinaryPublicId").notNull(),
  format: text("format"),
  bytes: integer("bytes"),
  altText: text("altText"),
  width: integer("width"),
  height: integer("height"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isCover: boolean("isCover").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    businessIdIdx: index("gallery_business_id_idx").on(table.businessId),
  }
});
