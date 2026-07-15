import { pgTable, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { business } from "./business";

export const preferredContactMethodEnum = pgEnum("preferred_contact_method", [
  "phone",
  "whatsapp",
  "email"
]);

export const businessContact = pgTable("business_contact", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().unique().references(() => business.id, { onDelete: "cascade" }),
  primaryPhone: text("primaryPhone"),
  secondaryPhone: text("secondaryPhone"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  website: text("website"),
  preferredContactMethod: preferredContactMethodEnum("preferredContactMethod"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    businessIdIdx: index("contact_business_id_idx").on(table.businessId),
  }
});
