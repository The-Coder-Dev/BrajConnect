import { pgTable, text, timestamp, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";
import { business } from "./business";
import { franchiseOpportunity } from "./franchise-opportunity";
import { franchiseApplication } from "./franchise-application";
import { user } from "./auth";

export const franchiseUnitStatusEnum = pgEnum("franchise_unit_status", [
  "setup_in_progress",
  "active",
  "temporarily_closed",
  "closed",
]);

export const franchiseUnit = pgTable("franchise_units", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "restrict" }),
  opportunityId: text("opportunityId").notNull().references(() => franchiseOpportunity.id, { onDelete: "restrict" }),
  applicationId: text("applicationId").notNull().references(() => franchiseApplication.id, { onDelete: "restrict" }),
  franchisePartnerId: text("franchisePartnerId").notNull().references(() => user.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode"),
  status: franchiseUnitStatusEnum("status").default("setup_in_progress").notNull(),
  openedAt: timestamp("openedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    applicationIdUnique: uniqueIndex("fu_application_id_unique").on(table.applicationId),
    businessIdIdx: index("fu_business_id_idx").on(table.businessId),
    opportunityIdIdx: index("fu_opportunity_id_idx").on(table.opportunityId),
    partnerIdIdx: index("fu_partner_id_idx").on(table.franchisePartnerId),
    statusIdx: index("fu_status_idx").on(table.status),
  };
});
