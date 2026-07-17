"use server";

import { db } from "@/db";
import { business, location } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";

export async function saveBusinessLocation(businessId: string, data: {
  country: string;
  state: string;
  district?: string;
  city: string;
  locality?: string;
  address: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  googlePlaceId?: string;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true }
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
    }

    // Explicitly map every field; coerce undefined optional values to null
    // so Drizzle never passes `undefined` into typed DB columns (e.g. doublePrecision).
    const locationData = {
      country: data.country,
      state: data.state,
      district: data.district ?? null,
      city: data.city,
      locality: data.locality ?? null,
      address: data.address,
      postalCode: data.postalCode,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      googlePlaceId: data.googlePlaceId ?? null,
    };

    const existingLocation = await db.query.location.findFirst({
      where: eq(location.businessId, businessId),
      columns: { id: true }
    });

    if (existingLocation) {
      await db.update(location)
        .set({
          ...locationData,
          updatedAt: new Date(),
        })
        .where(eq(location.businessId, businessId));
    } else {
      await db.insert(location).values({
        id: `loc_${Date.now()}`,
        businessId,
        ...locationData,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save location:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save location.") };
  }
}
