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
  | "shareCount"
  | "phone_click"
  | "whatsapp_click"
  | "website_click"
  | "direction_click"
  | "email_click"
  | "share";

const METRIC_MAP: Record<string, keyof typeof businessAnalytics._.columns> = {
  profileViews: "profileViews",
  phoneClicks: "phoneClicks",
  whatsappClicks: "whatsappClicks",
  websiteClicks: "websiteClicks",
  directionClicks: "directionClicks",
  shareCount: "shareCount",
  phone_click: "phoneClicks",
  whatsapp_click: "whatsappClicks",
  website_click: "websiteClicks",
  direction_click: "directionClicks",
  email_click: "websiteClicks",
  share: "shareCount",
};

/**
 * Public action: Track a user interaction metric for a business
 */
export async function trackBusinessMetric(businessId: string, inputMetric: MetricType) {
  try {
    if (!businessId || !inputMetric) return { success: false };

    const targetColumn = METRIC_MAP[inputMetric];
    if (!targetColumn) {
      return { success: false, error: "Invalid metric type" };
    }

    // Idempotent table check
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS business_analytics (
        id TEXT PRIMARY KEY,
        "businessId" TEXT NOT NULL UNIQUE REFERENCES business(id) ON DELETE CASCADE,
        "profileViews" INTEGER NOT NULL DEFAULT 0,
        "phoneClicks" INTEGER NOT NULL DEFAULT 0,
        "whatsappClicks" INTEGER NOT NULL DEFAULT 0,
        "websiteClicks" INTEGER NOT NULL DEFAULT 0,
        "directionClicks" INTEGER NOT NULL DEFAULT 0,
        "shareCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const existing = await db.query.businessAnalytics.findFirst({
      where: eq(businessAnalytics.businessId, businessId),
    });

    if (!existing) {
      await db.insert(businessAnalytics).values({
        id: `analytics_${randomUUID().replace(/-/g, "").substring(0, 16)}`,
        businessId,
        profileViews: targetColumn === "profileViews" ? 1 : 0,
        phoneClicks: targetColumn === "phoneClicks" ? 1 : 0,
        whatsappClicks: targetColumn === "whatsappClicks" ? 1 : 0,
        websiteClicks: targetColumn === "websiteClicks" ? 1 : 0,
        directionClicks: targetColumn === "directionClicks" ? 1 : 0,
        shareCount: targetColumn === "shareCount" ? 1 : 0,
      });
    } else {
      await db
        .update(businessAnalytics)
        .set({
          [targetColumn]: sql`${businessAnalytics[targetColumn]} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(businessAnalytics.businessId, businessId));
    }

    return { success: true };
  } catch (error) {
    console.error(`Failed to track metric ${inputMetric} for business ${businessId}:`, error);
    return { success: false };
  }
}
