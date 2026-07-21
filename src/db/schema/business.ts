import { pgTable, text, timestamp, boolean, pgEnum, integer, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const businessStatusEnum = pgEnum("business_status", [
  "draft",
  "pending_review",
  "published",
  "rejected",
  "suspended",
  "archived"
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "not_submitted",
  "pending",
  "verified",
  "rejected"
]);

export const business = pgTable("business", {
  id: text("id").primaryKey(),
  ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("shortDescription"),
  fullDescription: text("fullDescription"),
  establishedYear: integer("establishedYear"),
  logoUrl: text("logoUrl"),
  logoPublicId: text("logoPublicId"),
  coverUrl: text("coverUrl"),
  coverPublicId: text("coverPublicId"),
  status: businessStatusEnum("status").default("draft").notNull(),
  verificationStatus: verificationStatusEnum("verificationStatus").default("not_submitted").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
  rejectionReason: text("rejectionReason"),
  suspensionReason: text("suspensionReason"),
}, (table) => {
  return {
    nameIdx: index("name_idx").on(table.name),
    statusIdx: index("status_idx").on(table.status),
    featuredIdx: index("featured_idx").on(table.featured),
    // Composite index for the most common query: "all businesses by owner"
    // Used by getOwnerBusinesses() and getOwnerBusiness() on every dashboard page load.
    ownerIdIdx: index("owner_id_idx").on(table.ownerId),
    ownerIdBusinessIdIdx: index("owner_id_business_id_idx").on(table.ownerId, table.id),
  }
});

