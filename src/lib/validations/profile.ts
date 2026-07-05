import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email().optional(), // Usually read-only, but good to have
  phoneNumber: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
