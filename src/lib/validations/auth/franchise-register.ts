import { z } from "zod";

const indianPhoneRegex = /^[6-9]\d{9}$/;

export const individualFranchiseRegisterSchema = z.object({
  applicantType: z.literal("individual"),
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  mobileNumber: z.string().trim().regex(indianPhoneRegex, "Enter a valid 10-digit Indian mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  preferredState: z.string().trim().min(1, "Preferred state is required"),
  preferredCity: z.string().trim().min(1, "Preferred city is required"),
  investmentCapacity: z.string().trim().min(1, "Investment capacity is required"),
  previousExperience: z.string().trim().optional(),
  currentOccupation: z.string().trim().optional(),
  reasonForApplying: z.string().trim().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const companyFranchiseRegisterSchema = z.object({
  applicantType: z.literal("company"),
  companyName: z.string().trim().min(2, "Company name must be at least 2 characters"),
  companyEmail: z.string().trim().email("Please enter a valid company email address"),
  companyPhone: z.string().trim().regex(indianPhoneRegex, "Enter a valid 10-digit company phone number"),
  companyWebsite: z.string().trim().optional(),
  gstNumber: z.string().trim().optional(),
  panNumber: z.string().trim().optional(),
  companyDescription: z.string().trim().optional(),
  
  // Authorized Person
  authorizedPersonName: z.string().trim().min(2, "Authorized person's name is required"),
  authorizedPersonDesignation: z.string().trim().min(1, "Designation is required"),
  authorizedPersonEmail: z.string().trim().email("Please enter a valid email for the authorized person"),
  authorizedPersonPhone: z.string().trim().regex(indianPhoneRegex, "Enter a valid 10-digit mobile number for authorized person"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),

  preferredState: z.string().trim().min(1, "Preferred state is required"),
  preferredCity: z.string().trim().min(1, "Preferred city is required"),
  investmentCapacity: z.string().trim().min(1, "Investment capacity is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const franchiseRegisterSchema = z.discriminatedUnion("applicantType", [
  individualFranchiseRegisterSchema,
  companyFranchiseRegisterSchema,
]);

export type IndividualFranchiseInput = z.infer<typeof individualFranchiseRegisterSchema>;
export type CompanyFranchiseInput = z.infer<typeof companyFranchiseRegisterSchema>;
export type FranchiseRegisterInput = z.infer<typeof franchiseRegisterSchema>;
