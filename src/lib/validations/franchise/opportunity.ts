import { z } from "zod";

export const franchiseOpportunitySchema = z.object({
  businessId: z.string().min(1, "Business is required"),
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(20, "Please provide a detailed description (at least 20 characters)"),

  // Investment
  franchiseFee: z.string().trim().min(1, "Franchise fee is required"),
  estimatedInvestment: z.string().trim().min(1, "Estimated total investment is required"),
  investmentRange: z.string().trim().optional(),
  expectedSetupCost: z.string().trim().optional(),

  // Location
  availableState: z.string().trim().min(1, "Available state is required"),
  availableCity: z.string().trim().min(1, "Available city is required"),
  preferredArea: z.string().trim().optional(),
  territoryType: z.string().trim().optional(),

  // Requirements
  minSpaceRequired: z.string().trim().min(1, "Minimum space required is required"),
  experienceRequired: z.string().trim().optional(),
  eligibilityRequirements: z.string().trim().optional(),
  availableUnits: z.number().int().min(1, "At least 1 unit must be available"),

  // Support
  trainingProvided: z.string().trim().optional(),
  marketingSupport: z.string().trim().optional(),
  operationalSupport: z.string().trim().optional(),
  initialSetupSupport: z.string().trim().optional(),

  // Agreement
  agreementDuration: z.string().trim().optional(),
  renewalTerms: z.string().trim().optional(),

  // Additional
  termsConditions: z.string().trim().optional(),
  requiredDocuments: z.string().trim().optional(),
});

export type FranchiseOpportunityInput = z.infer<typeof franchiseOpportunitySchema>;
