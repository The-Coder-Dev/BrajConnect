import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { business } from "./business";

export const businessAnalytics = pgTable("business_analytics", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().unique().references(() => business.id, { onDelete: "cascade" }),
  profileViews: integer("profileViews").default(0).notNull(),
  phoneClicks: integer("phoneClicks").default(0).notNull(),
  whatsappClicks: integer("whatsappClicks").default(0).notNull(),
  websiteClicks: integer("websiteClicks").default(0).notNull(),
  directionClicks: integer("directionClicks").default(0).notNull(),
  shareCount: integer("shareCount").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});
