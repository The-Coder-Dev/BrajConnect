"use server";

import { db } from "@/db";
import { amenities } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getActiveAmenities() {
  try {
    const data = await db.query.amenities.findMany({
      where: eq(amenities.active, true),
      orderBy: [asc(amenities.sortOrder)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch amenities:", error);
    return { success: false, error: "Unable to load amenities." };
  }
}