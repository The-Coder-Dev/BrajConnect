"use server";

import { db } from "@/db";
import { category } from "@/db/schema/category";
import { dynamicFields } from "@/db/schema/dynamic-fields";
import { eq, and, asc } from "drizzle-orm";

const MOCK_CATEGORIES = [
  { id: "cat_retail", name: "Retail & Shopping", icon: "Store", sortOrder: 1, active: true, slug: "retail", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: "cat_food", name: "Food & Dining", icon: "Utensils", sortOrder: 2, active: true, slug: "food", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: "cat_home", name: "Home Services", icon: "Wrench", sortOrder: 3, active: true, slug: "home", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: "cat_health", name: "Health & Medical", icon: "Stethoscope", sortOrder: 4, active: true, slug: "health", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: "cat_prof", name: "Professional Services", icon: "Briefcase", sortOrder: 5, active: true, slug: "prof", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: "cat_tech", name: "Tech & Software", icon: "Code", sortOrder: 6, active: true, slug: "tech", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: "cat_beauty", name: "Beauty & Spa", icon: "Scissors", sortOrder: 7, active: true, slug: "beauty", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: "cat_ent", name: "Entertainment", icon: "MonitorPlay", sortOrder: 8, active: true, slug: "ent", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: "cat_cafe", name: "Cafe & Bakery", icon: "Coffee", sortOrder: 9, active: true, slug: "cafe", description: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
];

export async function getCategories() {
  try {
    const categories = await db
      .select()
      .from(category)
      .where(eq(category.active, true))
      .orderBy(asc(category.sortOrder));
      
    if (categories.length === 0) {
      return MOCK_CATEGORIES;
    }
      
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return MOCK_CATEGORIES;
  }
}

const MOCK_DYNAMIC_FIELDS: Record<string, any[]> = {
  "cat_food": [
    { id: "df1", categoryId: "cat_food", key: "cuisine", label: "Cuisine Type", inputType: "text", required: true, helpText: "E.g., Italian, Indian, Mexican", sortOrder: 1, active: true },
    { id: "df2", categoryId: "cat_food", key: "seating_capacity", label: "Seating Capacity", inputType: "number", required: false, helpText: "Approximate number of seats", sortOrder: 2, active: true },
    { id: "df3", categoryId: "cat_food", key: "has_wifi", label: "Free Wi-Fi", inputType: "switch", required: false, sortOrder: 3, active: true },
  ],
  "cat_health": [
    { id: "df4", categoryId: "cat_health", key: "emergency", label: "Emergency Available", inputType: "switch", required: true, sortOrder: 1, active: true },
    { id: "df5", categoryId: "cat_health", key: "icu_beds", label: "ICU Beds", inputType: "number", required: false, sortOrder: 2, active: true },
    { id: "df6", categoryId: "cat_health", key: "ambulance", label: "Ambulance Service", inputType: "switch", required: false, sortOrder: 3, active: true },
  ]
};

export async function getCategoryDynamicFields(categoryId: string) {
  try {
    const fields = await db
      .select()
      .from(dynamicFields)
      .where(
        and(
          eq(dynamicFields.categoryId, categoryId),
          eq(dynamicFields.active, true)
        )
      )
      .orderBy(asc(dynamicFields.sortOrder));
      
    if (fields.length === 0 && MOCK_DYNAMIC_FIELDS[categoryId]) {
      return MOCK_DYNAMIC_FIELDS[categoryId];
    }
      
    return fields;
  } catch (error) {
    console.error("Failed to fetch dynamic fields:", error);
    return MOCK_DYNAMIC_FIELDS[categoryId] || [];
  }
}
