import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { category } from "./category";

export const businessStatusEnum = pgEnum("business_status", [
  "draft",
  "pending_review",
  "published",
  "rejected",
  "suspended"
]);

export const business = pgTable("business", {
  id: text("id").primaryKey(),
  ownerId: text("ownerId").notNull().references(() => user.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  logoUrl: text("logoUrl"),
  logoPublicId: text("logoPublicId"),
  coverUrl: text("coverUrl"),
  coverPublicId: text("coverPublicId"),
  categoryId: text("categoryId").references(() => category.id),
  status: businessStatusEnum("status").default("draft").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});
