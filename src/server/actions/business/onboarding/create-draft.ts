"use server";

import { db } from "@/db";
import { business } from "@/db/schema";
import { generateUniqueBusinessSlug } from "@/lib/slug/generate-slug-server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { randomUUID } from "crypto";

import { getFriendlyErrorMessage } from "@/lib/utils";

export async function createDraftBusiness(name: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Check if user already has a draft
    // If they do, maybe just return it. But onboarding should reuse getDraftBusiness for that.
    // Assuming this is only called when no draft exists.
    const slug = await generateUniqueBusinessSlug(name);
    const businessId = `biz_${Date.now()}_${randomUUID().split("-")[0]}`;

    await db.insert(business).values({
      id: businessId,
      ownerId: userId,
      name,
      slug,
      status: "draft",
    });

    return { success: true, businessId };
  } catch (error: any) {
    console.error("Failed to create draft:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to create business draft. Please try again.") };
  }
}
