"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { business, businessActivity, user } from "@/db/schema";
import { eq, gte, count, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/guards";
import { getFriendlyErrorMessage } from "@/lib/utils";

export async function getAdminDashboardStats() {
  try {
    await requireAdmin();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Run statistical queries in parallel
    const [
      totalCountRes,
      pendingCountRes,
      publishedCountRes,
      rejectedCountRes,
      draftCountRes,
      todaySubmissionsRes,
      recentActivities,
      latestBusinesses,
    ] = await Promise.all([
      db.select({ value: count() }).from(business),
      db.select({ value: count() }).from(business).where(eq(business.status, "pending_review")),
      db.select({ value: count() }).from(business).where(eq(business.status, "published")),
      db.select({ value: count() }).from(business).where(eq(business.status, "rejected")),
      db.select({ value: count() }).from(business).where(eq(business.status, "draft")),
      db.select({ value: count() }).from(business).where(gte(business.createdAt, startOfToday)),
      
      // Recent activities with relations
      db.query.businessActivity.findMany({
        limit: 10,
        orderBy: [desc(businessActivity.createdAt)],
        with: {
          business: {
            columns: { id: true, name: true, slug: true },
          },
          performedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
        },
      }),

      // Latest businesses
      db.query.business.findMany({
        limit: 5,
        orderBy: [desc(business.createdAt)],
        columns: {
          id: true,
          name: true,
          slug: true,
          status: true,
          createdAt: true,
        },
        with: {
          owner: {
            columns: { name: true, email: true },
          },
          businessCategories: {
            with: {
              category: { columns: { name: true } },
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalBusinesses: totalCountRes[0]?.value || 0,
        pendingVerification: pendingCountRes[0]?.value || 0,
        published: publishedCountRes[0]?.value || 0,
        rejected: rejectedCountRes[0]?.value || 0,
        drafts: draftCountRes[0]?.value || 0,
        todaySubmissions: todaySubmissionsRes[0]?.value || 0,
        recentActivities,
        latestBusinesses,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch admin dashboard stats:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Unable to load admin statistics."),
    };
  }
}
