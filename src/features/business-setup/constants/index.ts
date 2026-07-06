import { SetupStep } from "../types";

export const SETUP_STEPS: SetupStep[] = [
  { id: "welcome", title: "Welcome", fields: [] },
  { id: "name", title: "Business Name", fields: ["name"] },
  { id: "category", title: "Category", fields: ["categoryId"] },
  { id: "contact", title: "Contact Details", fields: ["phone", "email", "website"] },
  { id: "location", title: "Location", fields: ["country", "state", "city", "address"] },
  { id: "brand", title: "Brand Identity", fields: ["logoUrl", "coverUrl", "galleryUrls"] },
  { id: "about", title: "About Business", fields: ["description"] },
  { id: "review", title: "Review", fields: [] },
  { id: "success", title: "Success", fields: [] },
];
