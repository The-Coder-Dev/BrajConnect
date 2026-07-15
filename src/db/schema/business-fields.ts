import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { business } from "./business";
import { dynamicFields } from "./dynamic-fields";

export const businessFields = pgTable("business_fields", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  dynamicFieldId: text("dynamicFieldId").notNull().references(() => dynamicFields.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    businessIdIdx: index("business_fields_business_id_idx").on(table.businessId),
    dynamicFieldIdIdx: index("business_fields_dynamic_field_id_idx").on(table.dynamicFieldId),
  }
});
