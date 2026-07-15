import { pgTable, text, timestamp, boolean, integer, pgEnum, jsonb, index } from "drizzle-orm/pg-core";
import { category } from "./category";

export const inputTypeEnum = pgEnum("input_type", [
  "text",
  "textarea",
  "number",
  "select",
  "checkbox",
  "radio",
  "date"
]);

export const dynamicFields = pgTable("dynamic_fields", {
  id: text("id").primaryKey(),
  categoryId: text("categoryId").notNull().references(() => category.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  key: text("key").notNull(),
  inputType: inputTypeEnum("inputType").notNull(),
  required: boolean("required").default(false).notNull(),
  placeholder: text("placeholder"),
  defaultValue: text("defaultValue"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  options: jsonb("options"), // Array of strings or objects for select/radio
  helpText: text("helpText"),
  validationMetadata: jsonb("validationMetadata"), // min, max, regex, etc.
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => {
  return {
    categoryIdIdx: index("dynamic_fields_category_id_idx").on(table.categoryId),
  }
});
