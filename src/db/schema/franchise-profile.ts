import { pgTable, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const franchiseApplicantTypeEnum = pgEnum("franchise_applicant_type", [
  "individual",
  "company"
]);

export const franchiseProfile = pgTable("franchise_profiles", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  applicantType: franchiseApplicantTypeEnum("applicantType").notNull(),

  // Individual-specific fields
  fullName: text("fullName"),
  mobileNumber: text("mobileNumber"),
  currentOccupation: text("currentOccupation"),
  previousExperience: text("previousExperience"),
  reasonForApplying: text("reasonForApplying"),

  // Company-specific fields
  companyName: text("companyName"),
  companyEmail: text("companyEmail"),
  companyPhone: text("companyPhone"),
  companyWebsite: text("companyWebsite"),
  gstNumber: text("gstNumber"),
  panNumber: text("panNumber"),
  companyDescription: text("companyDescription"),

  // Authorized Person (for Company)
  authorizedPersonName: text("authorizedPersonName"),
  authorizedPersonDesignation: text("authorizedPersonDesignation"),
  authorizedPersonEmail: text("authorizedPersonEmail"),
  authorizedPersonPhone: text("authorizedPersonPhone"),

  // Common franchise criteria
  preferredState: text("preferredState").notNull(),
  preferredCity: text("preferredCity").notNull(),
  investmentCapacity: text("investmentCapacity").notNull(),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("franchise_profile_user_id_idx").on(table.userId),
    applicantTypeIdx: index("franchise_profile_applicant_type_idx").on(table.applicantType),
  };
});
