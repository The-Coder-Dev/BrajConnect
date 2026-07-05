import { z } from "zod";
import { BUSINESS } from "@/lib/constants/business";

// Placeholders for future forms
export const businessSetupSchema = z.object({
  name: z.string().min(2).max(BUSINESS.LIMITS.NAME_MAX_LENGTH),
  description: z.string().max(BUSINESS.LIMITS.DESCRIPTION_MAX_LENGTH).optional(),
  categoryId: z.string().min(1, "Category is required"),
  // Additional fields will be added during Onboarding UI implementation
});

export type BusinessSetupInput = z.infer<typeof businessSetupSchema>;
