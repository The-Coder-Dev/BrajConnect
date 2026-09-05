import { pgTable, text, timestamp, pgEnum, integer, index } from "drizzle-orm/pg-core";
import { business } from "./business";
import { user } from "./auth";

export const franchiseOpportunityStatusEnum = pgEnum("franchise_opportunity_status", [
  "draft",
  "pending_review",
  "approved",
  "rejected",
  "closed"
]);

export const franchiseOpportunity = pgTable("franchise_opportunities", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),

  // Investment
  franchiseFee: text("franchiseFee").notNull(),
  estimatedInvestment: text("estimatedInvestment").notNull(),
  investmentRange: text("investmentRange"),
  expectedSetupCost: text("expectedSetupCost"),

  // Location
  availableState: text("availableState").notNull(),
  availableCity: text("availableCity").notNull(),
  preferredArea: text("preferredArea"),
  territoryType: text("territoryType"), // e.g. Exclusive, Non-Exclusive, Multi-Unit

  // Requirements
  minSpaceRequired: text("minSpaceRequired").notNull(),
  experienceRequired: text("experienceRequired"),
  eligibilityRequirements: text("eligibilityRequirements"),
  availableUnits: integer("availableUnits").default(1).notNull(),

  // Support
  trainingProvided: text("trainingProvided"),
  marketingSupport: text("marketingSupport"),
  operationalSupport: text("operationalSupport"),
  initialSetupSupport: text("initialSetupSupport"),

  // Agreement
  agreementDuration: text("agreementDuration"),
  renewalTerms: text("renewalTerms"),

  // Additional Information
  termsConditions: text("termsConditions"),
  requiredDocuments: text("requiredDocuments"),

  // Workflow Status
  status: franchiseOpportunityStatusEnum("status").default("draft").notNull(),
  rejectionReason: text("rejectionReason"),
  approvedAt: timestamp("approvedAt", { mode: "date" }),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    businessIdIdx: index("fo_business_id_idx").on(table.businessId),
    ownerIdIdx: index("fo_owner_id_idx").on(table.ownerId),
    statusIdx: index("fo_status_idx").on(table.status),
    slugIdx: index("fo_slug_idx").on(table.slug),
    locationIdx: index("fo_location_idx").on(table.availableState, table.availableCity),
  };
});
