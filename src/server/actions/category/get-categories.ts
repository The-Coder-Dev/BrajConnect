"use server";

import { db } from "@/db";
import { category } from "@/db/schema/category";
import { dynamicFields } from "@/db/schema/dynamic-fields";
import { eq, and, asc } from "drizzle-orm";

import { isRegisteredCategory } from "@/config/business-categories";

/**
 * Fetches all active approved categories from PostgreSQL.
 * Returns an empty array if none exist — callers must handle this gracefully.
 * Excludes deactivated/legacy categories and returns only approved registered categories.
 */
export async function getCategories() {
  try {
    const categories = await db
      .select()
      .from(category)
      .where(eq(category.active, true))
      .orderBy(asc(category.sortOrder));

    // Filter to ensure only registered approved categories are returned
    return categories.filter((c) => isRegisteredCategory(c.slug) || isRegisteredCategory(c.id));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/**
 * Fetches all active dynamic fields for a given category from PostgreSQL.
 * Returns an empty array if none exist — the UI already handles this state.
 * Never falls back to mock data.
 */
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

    return fields;
  } catch (error) {
    console.error("Failed to fetch dynamic fields:", error);
    return [];
  }
}

