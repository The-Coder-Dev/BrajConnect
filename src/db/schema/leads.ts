import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { business } from "./business";
import { user } from "./auth";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "closed",
  "archived",
]);

export const businessLeads = pgTable("business_leads", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "cascade" }),
  visitorName: text("visitorName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  preferredContact: text("preferredContact").default("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: leadStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});
