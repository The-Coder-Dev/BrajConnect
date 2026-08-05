"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { businessAnalytics } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export type MetricType =
  | "profileViews"
  | "phoneClicks"
  | "whatsappClicks"
  | "websiteClicks"
  | "directionClicks"
  | "shareCount";

/**
 * Public action: Track a user interaction metric for a business
 */
export async function trackBusinessMetric(businessId: string, metricType: MetricType) {
  try {
    if (!businessId || !metricType) return { success: false };

    const validMetrics: MetricType[] = [
      "profileViews",
      "phoneClicks",
      "whatsappClicks",
      "websiteClicks",
      "directionClicks",
      "shareCount",
    ];

    if (!validMetrics.includes(metricType)) {
      return { success: false, error: "Invalid metric type" };
    }

    const existing = await db.query.businessAnalytics.findFirst({
      where: eq(businessAnalytics.businessId, businessId),
    });

    if (!existing) {
      await db.insert(businessAnalytics).values({
        id: `analytics_${randomUUID().replace(/-/g, "").substring(0, 16)}`,
        businessId,
        profileViews: metricType === "profileViews" ? 1 : 0,
        phoneClicks: metricType === "phoneClicks" ? 1 : 0,
        whatsappClicks: metricType === "whatsappClicks" ? 1 : 0,
        websiteClicks: metricType === "websiteClicks" ? 1 : 0,
        directionClicks: metricType === "directionClicks" ? 1 : 0,
        shareCount: metricType === "shareCount" ? 1 : 0,
      });
    } else {
      await db
        .update(businessAnalytics)
        .set({
          [metricType]: sql`${businessAnalytics[metricType]} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(businessAnalytics.businessId, businessId));
    }

    return { success: true };
  } catch (error) {
    console.error(`Failed to track metric ${metricType} for business ${businessId}:`, error);
    return { success: false };
  }
}
