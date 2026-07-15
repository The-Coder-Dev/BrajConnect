import { pgTable, text, timestamp, pgEnum, integer, index } from "drizzle-orm/pg-core";
import { business } from "./business";

export const socialPlatformEnum = pgEnum("social_platform", [
  "website",
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
  "x",
  "whatsapp",
  "telegram"
]);

export const social = pgTable("social", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  platform: socialPlatformEnum("platform").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    businessIdIdx: index("social_business_id_idx").on(table.businessId),
  }
});
