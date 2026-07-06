import { z } from "zod";
import { BUSINESS } from "@/lib/constants/business";

export const businessSetupSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters").max(BUSINESS.LIMITS.NAME_MAX_LENGTH),
  categoryId: z.string().min(1, "Please select a category"),
  phone: z.string().regex(BUSINESS.VALIDATION.PHONE_REGEX, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  description: z.string().max(BUSINESS.LIMITS.DESCRIPTION_MAX_LENGTH).optional().or(z.literal("")),
  // Visual placeholders for uploads (will map to cloudinary publicIds later)
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  galleryUrls: z.array(z.string()).optional(),
});

export type BusinessSetupInput = z.infer<typeof businessSetupSchema>;

export const defaultBusinessSetupValues: Partial<BusinessSetupInput> = {
  name: "",
  categoryId: "",
  phone: "",
  email: "",
  website: "",
  country: "",
  state: "",
  city: "",
  address: "",
  description: "",
  logoUrl: "",
  coverUrl: "",
  galleryUrls: [],
};
