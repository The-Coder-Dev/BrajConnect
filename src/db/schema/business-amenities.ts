import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { business } from "./business";
import { amenities } from "./amenities";

export const businessAmenities = pgTable("business_amenities", {
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  amenityId: text("amenityId").notNull().references(() => amenities.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.businessId, table.amenityId] })
  }
});
