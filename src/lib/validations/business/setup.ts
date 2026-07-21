import { z } from "zod";
import { BUSINESS } from "@/lib/constants/business";

export const cloudinaryImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
});

export const galleryImageSchema = cloudinaryImageSchema.extend({
  altText: z.string().optional(),
  isCover: z.boolean().default(false),
});

export const documentUploadSchema = z.object({
  type: z.enum(["gst", "pan", "registration_certificate", "trade_license", "other"]),
  fileName: z.string(),
  storagePath: z.string(),
  mimeType: z.string(),
});

export const businessHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6), // 0-6 (0 is Sunday)
  isClosed: z.boolean(),
  is24Hours: z.boolean(),
  openTime: z.string().optional(), // "HH:mm"
  closeTime: z.string().optional(), // "HH:mm"
});

export const socialLinkSchema = z.object({
  platform: z.enum(["website", "instagram", "facebook", "linkedin", "youtube", "x", "whatsapp", "telegram"]),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const businessSetupSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters").max(BUSINESS.LIMITS.NAME_MAX_LENGTH),
  categoryId: z.string().min(1, "Please select a category"),
  
  // Contact
  phone: z.string().regex(BUSINESS.VALIDATION.PHONE_REGEX, "Invalid phone number format").optional().or(z.literal("")),
  whatsapp: z.string().regex(BUSINESS.VALIDATION.PHONE_REGEX, "Invalid phone number format").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  preferredContactMethod: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const lower = val.toLowerCase().trim();
        if (lower === "phone" || lower === "whatsapp" || lower === "email") {
          return lower;
        }
      }
      return undefined;
    },
    z.enum(["phone", "whatsapp", "email"]).optional()
  ),

  // Location
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  district: z.string().optional(),
  city: z.string().min(2, "City is required"),
  locality: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  googlePlaceId: z.string().optional(),

  // About
  shortDescription: z.string().max(200).optional(),
  description: z.string().max(BUSINESS.LIMITS.DESCRIPTION_MAX_LENGTH).optional().or(z.literal("")),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),

  // Brand
  logo: cloudinaryImageSchema.optional(),
  cover: cloudinaryImageSchema.optional(),
  gallery: z.array(galleryImageSchema).default([]),

  // Hours
  hours: z.array(businessHoursSchema).default([]),

  // Social
  socialLinks: z.array(socialLinkSchema).default([]),

  // Documents
  documents: z.array(documentUploadSchema).default([]),

  // Dynamic Fields
  dynamicFields: z.record(z.string(), z.any()).default({}),

  // Services
  services: z.array(z.object({
    name: z.string().min(1, "Service name is required"),
    description: z.string().max(200, "Description cannot exceed 200 characters").optional().or(z.literal("")),
  })).default([]),

  // Amenities
  amenities: z.array(z.string()).default([]),
});

export type BusinessSetupInput = z.infer<typeof businessSetupSchema>;

export const defaultBusinessSetupValues: Partial<BusinessSetupInput> = {
  name: "",
  categoryId: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  country: "",
  state: "",
  district: "",
  city: "",
  locality: "",
  address: "",
  postalCode: "",
  shortDescription: "",
  description: "",
  gallery: [],
  hours: Array.from({ length: 7 }).map((_, i) => ({
    dayOfWeek: i,
    isClosed: false,
    is24Hours: false,
    openTime: "09:00",
    closeTime: "18:00",
  })),
  socialLinks: [
    { platform: "website", url: "" },
    { platform: "instagram", url: "" },
    { platform: "facebook", url: "" },
    { platform: "linkedin", url: "" },
    { platform: "youtube", url: "" },
    { platform: "x", url: "" },
    { platform: "whatsapp", url: "" },
    { platform: "telegram", url: "" }
  ],
  documents: [],
  dynamicFields: {},
  services: [],
  amenities: [],
  preferredContactMethod: "phone",
};
