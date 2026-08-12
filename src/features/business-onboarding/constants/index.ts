import { SetupStep } from "../types";

export const SETUP_STEPS: SetupStep[] = [
  { id: "welcome", title: "Welcome", fields: [] },
  { id: "name", title: "Business Basics", fields: ["name"] },
  { id: "category", title: "Category", fields: ["categoryId"] },
  { id: "dynamic_fields", title: "Category Details", fields: ["categoryData"] },
  { id: "contact", title: "Contact & Social", fields: ["phone", "whatsapp", "email", "website", "preferredContactMethod", "socialLinks"] },
  { id: "location", title: "Location", fields: ["country", "state", "city", "address", "postalCode"] },
  { id: "hours", title: "Business Hours", fields: ["hours"] },
  { id: "brand", title: "Brand & Media", fields: ["logo", "cover", "gallery"] },
  { id: "about", title: "About Business", fields: ["description", "shortDescription", "establishedYear"] },
  { id: "documents", title: "Verification Documents", fields: ["documents"] },
  { id: "review", title: "Review & Submit", fields: [] },
  { id: "success", title: "Success", fields: [] },
];
