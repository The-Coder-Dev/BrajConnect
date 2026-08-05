"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { logBusinessActivity } from "@/server/actions/activity/log-activity";

export async function saveBusinessBasic(businessId: string, data: {
  name?: string;
  shortDescription?: string;
  description?: string;
  establishedYear?: number;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership strictly
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true, name: true, slug: true, status: true }
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
    }

    await db.update(business)
      .set({
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription.trim() }),
        ...(data.description !== undefined && { fullDescription: data.description.trim() }),
        ...(data.establishedYear !== undefined && { establishedYear: data.establishedYear }),
        updatedAt: new Date(),
      })
      .where(eq(business.id, businessId));

    await logBusinessActivity({
      businessId,
      userId: session.user.id,
      type: "updated",
      title: "Business Details Updated",
      description: `Basic information for "${data.name || existing.name}" was edited.`,
    });

    revalidatePath("/dashboard");
    if (existing.slug) revalidatePath(`/business/${existing.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save basic info:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save basic business details.") };
  }
}
