import { pgTable, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { franchiseOpportunity } from "./franchise-opportunity";
import { business } from "./business";
import { user } from "./auth";
import { franchiseApplicantTypeEnum } from "./franchise-profile";

export const franchiseApplicationStatusEnum = pgEnum("franchise_application_status", [
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "withdrawn"
]);

export const franchiseApplication = pgTable("franchise_applications", {
  id: text("id").primaryKey(),
  opportunityId: text("opportunityId").notNull().references(() => franchiseOpportunity.id, { onDelete: "cascade" }),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  franchisePartnerId: text("franchisePartnerId").notNull().references(() => user.id, { onDelete: "cascade" }),
  applicantType: franchiseApplicantTypeEnum("applicantType").notNull(),

  // Applicant info
  applicantName: text("applicantName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),

  // Location & Investment
  preferredLocation: text("preferredLocation").notNull(),
  investmentCapacity: text("investmentCapacity").notNull(),

  // Details
  businessExperience: text("businessExperience"),
  relevantExperience: text("relevantExperience"),
  whyInterested: text("whyInterested"),
  additionalComments: text("additionalComments"),
  documentUrl: text("documentUrl"),

  // Status & Review notes
  status: franchiseApplicationStatusEnum("status").default("submitted").notNull(),
  reviewNotes: text("reviewNotes"),
  reviewedBy: text("reviewedBy").references(() => user.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewedAt", { mode: "date" }),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    opportunityIdIdx: index("fa_opportunity_id_idx").on(table.opportunityId),
    businessIdIdx: index("fa_business_id_idx").on(table.businessId),
    partnerIdIdx: index("fa_partner_id_idx").on(table.franchisePartnerId),
    statusIdx: index("fa_status_idx").on(table.status),
  };
});
