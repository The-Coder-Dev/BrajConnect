import { z } from "zod";

export const franchiseApplicationSchema = z.object({
  opportunityId: z.string().min(1, "Opportunity is required"),
  preferredLocation: z.string().trim().min(2, "Preferred location is required"),
  investmentCapacity: z.string().trim().min(1, "Investment capacity is required"),
  businessExperience: z.string().trim().optional(),
  relevantExperience: z.string().trim().optional(),
  whyInterested: z.string().trim().optional(),
  additionalComments: z.string().trim().optional(),
  documentUrl: z.string().trim().optional(),
});

export type FranchiseApplicationInput = z.infer<typeof franchiseApplicationSchema>;
