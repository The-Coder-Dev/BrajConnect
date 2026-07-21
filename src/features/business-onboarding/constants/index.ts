import { SetupStep } from "../types";

export const SETUP_STEPS: SetupStep[] = [
  { id: "welcome", title: "Welcome", fields: [] },
  { id: "name", title: "Business Name", fields: ["name"] },
  { id: "category", title: "Category", fields: ["categoryId"] },
  { id: "dynamic_fields", title: "Details", fields: ["dynamicFields"] },
  { id: "contact", title: "Contact Details", fields: ["phone", "whatsapp", "email", "website", "preferredContactMethod"] },
  { id: "location", title: "Location", fields: ["country", "state", "city", "address", "postalCode"] },
  { id: "hours", title: "Business Hours", fields: ["hours"] },
  { id: "social", title: "Social Links", fields: ["socialLinks"] },
  { id: "brand", title: "Brand Identity", fields: ["logo", "cover"] },
  { id: "gallery", title: "Gallery", fields: ["gallery"] },
  { id: "about", title: "About Business", fields: ["description", "shortDescription", "establishedYear"] },
  { id: "documents", title: "Verification", fields: ["documents"] },
  { id: "services", title: "Services Offered", fields: ["services"] },
  { id: "amenities", title: "Amenities", fields: ["amenities"] },
  { id: "review", title: "Review", fields: [] },
  { id: "success", title: "Success", fields: [] },
];
