"use server";

import { db } from "@/db";
import { business, businessContact, location, businessHours, social, gallery, businessDocuments, businessFields, businessCategory } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";

export async function getDraftBusiness() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Fetch the draft business
    const draft = await db.query.business.findFirst({
      where: and(
        eq(business.ownerId, userId),
        eq(business.status, "draft")
      ),
      with: {
        contact: true,
        location: true,
        hours: true,
        socials: true,
        gallery: true,
        documents: true,
        businessCategories: true,
        businessFields: true,
      }
    });

    if (!draft) {
      return { success: true, data: null };
    }

    return { success: true, data: draft };
  } catch (error: any) {
    console.error("Failed to fetch draft business:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to fetch business draft.") };
  }
}
