import { pgTable, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { business } from "./business";
import { user } from "./auth";

export const reviewStatusEnum = pgEnum("review_status", [
  "approved",
  "rejected",
  "changes_requested"
]);

export const businessReview = pgTable("business_review", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  reviewedBy: text("reviewedBy").notNull().references(() => user.id, { onDelete: "cascade" }),
  status: reviewStatusEnum("status").notNull(),
  feedback: text("feedback"),
  reviewedAt: timestamp("reviewedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    reviewBizIdx: index("review_biz_idx").on(table.businessId),
    reviewedAtIdx: index("reviewed_at_idx").on(table.reviewedAt),
  };
});

export const activityActionEnum = pgEnum("activity_action", [
  "submitted",
  "approved",
  "rejected",
  "changes_requested"
]);

export const businessActivity = pgTable("business_activity", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  action: activityActionEnum("action").notNull(),
  performedBy: text("performedBy").references(() => user.id, { onDelete: "set null" }),
  reason: text("reason"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    activityBizIdx: index("activity_biz_idx").on(table.businessId),
    activityCreatedAtIdx: index("activity_created_at_idx").on(table.createdAt),
  };
});
