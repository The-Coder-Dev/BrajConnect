import { pgTable, text } from "drizzle-orm/pg-core";
import { business } from "./business";

export const location = pgTable("location", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  country: text("country").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  postalCode: text("postalCode").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  formattedAddress: text("formattedAddress"),
});
