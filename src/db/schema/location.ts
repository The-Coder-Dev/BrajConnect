import { pgTable, text, timestamp, index, doublePrecision } from "drizzle-orm/pg-core";
import { business } from "./business";

export const location = pgTable("location", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().unique().references(() => business.id, { onDelete: "cascade" }),
  country: text("country").notNull(),
  state: text("state").notNull(),
  district: text("district"),
  city: text("city").notNull(),
  locality: text("locality"),
  postalCode: text("postalCode").notNull(),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  formattedAddress: text("formattedAddress"),
  googlePlaceId: text("googlePlaceId"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    businessIdIdx: index("location_business_id_idx").on(table.businessId),
    cityIdx: index("location_city_idx").on(table.city),
    districtIdx: index("location_district_idx").on(table.district),
  }
});
