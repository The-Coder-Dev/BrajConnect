import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { business } from "./business";
import { user } from "./auth";

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
  authorName: text("authorName").notNull(),
  authorEmail: text("authorEmail").notNull(),
  authorAvatar: text("authorAvatar"),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  status: text("status").notNull().default("pending"),
  ownerResponse: text("ownerResponse"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});
