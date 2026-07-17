"use server";

import { db } from "@/db";
import { business, social, socialPlatformEnum } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";

type SocialLink = {
  platform: typeof socialPlatformEnum.enumValues[number];
  url: string;
};

export async function saveBusinessSocials(businessId: string, links: SocialLink[]) {
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

    // Delete existing social links
    await db.delete(social).where(eq(social.businessId, businessId));

    // Insert new ones, ignoring empty urls
    const validLinks = links.filter(l => l.url && l.url.trim().length > 0);
    if (validLinks.length > 0) {
      const rows = validLinks.map((l, index) => ({
        id: `soc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        businessId,
        platform: l.platform,
        url: l.url.trim(),
        sortOrder: index,
      }));

      await db.insert(social).values(rows);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save socials:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save social links.") };
  }
}
