import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { business } from "./business";

export const gallery = pgTable("gallery", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  imageUrl: text("imageUrl").notNull(),
  publicId: text("publicId").notNull(),
  altText: text("altText"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
