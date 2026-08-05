"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { business, businessLeads, notifications, businessAnalytics, activityLogs, reviews } from "@/db/schema";
import { eq, and, desc, avg, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { calculateBusinessHealthScore, HealthScoreResult } from "@/lib/utils/health-score";

export type DashboardLifecycleState =
  | "NO_BUSINESS"
  | "DRAFT"
  | "PENDING_REVIEW"
  | "REJECTED"
  | "PUBLISHED";

export interface DraftCompletionInfo {
  percentage: number;
  missingSteps: string[];
}

export interface ActivityTimelineItem {
  id: string;
  type: string;
  title: string;
  description: string;
  time: Date;
}

export async function getAdaptiveDashboardData(selectedBusinessId?: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      console.warn("[Adaptive Dashboard] Unauthenticated session check");
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    console.log(`[Adaptive Dashboard] Loading data for User ID: ${userId}, Selected Business ID: ${selectedBusinessId || "None"}`);

    // Fetch all businesses owned by this user
    let ownerBusinesses: any[] = [];
    try {
      ownerBusinesses = await db.query.business.findMany({
        where: eq(business.ownerId, userId),
        with: {
          location: true,
          contact: true,
          hours: true,
          socials: true,
          gallery: true,
          documents: true,
          businessCategories: {
            with: { category: true },
          },
          services: true,
          businessAmenities: true,
        },
        orderBy: [desc(business.updatedAt)],
      });
    } catch (bizQueryErr) {
      console.error("[Adaptive Dashboard] Fatal error querying user businesses:", bizQueryErr);
      return {
        success: false,
        error: getFriendlyErrorMessage(bizQueryErr, "Unable to query businesses."),
      };
    }

    console.log(`[Adaptive Dashboard] Found ${ownerBusinesses.length} business(es) owned by User ${userId}`);

    // 1. STATE A: NO_BUSINESS
    if (ownerBusinesses.length === 0) {
      console.log(`[Adaptive Dashboard] Resolved State: NO_BUSINESS`);
      return {
        success: true,
        data: {
          state: "NO_BUSINESS" as DashboardLifecycleState,
          user: session.user,
          businesses: [],
          activeBusiness: null,
          draftCompletion: null,
          healthScore: null,
          metrics: {
            profileViews: 0,
            phoneClicks: 0,
            whatsappClicks: 0,
            websiteClicks: 0,
            directionClicks: 0,
            shareCount: 0,
            totalLeads: 0,
            unreadLeads: 0,
            averageRating: 5.0,
            reviewsCount: 0,
          },
          leads: [],
          notifications: [],
          unreadNotificationsCount: 0,
          activities: [],
        },
      };
    }

    // Determine active business (multi-business future-proof)
    let activeBiz = ownerBusinesses[0];
    if (selectedBusinessId) {
      const match = ownerBusinesses.find((b) => b.id === selectedBusinessId);
      if (match) activeBiz = match;
    } else {
      // Priority: published > pending_review > rejected > draft
      const published = ownerBusinesses.find((b) => b.status === "published");
      const pending = ownerBusinesses.find((b) => b.status === "pending_review");
      const rejected = ownerBusinesses.find((b) => b.status === "rejected");
      activeBiz = published || pending || rejected || ownerBusinesses[0];
    }

    // Determine Lifecycle State based on active business status
    let state: DashboardLifecycleState = "DRAFT";
    switch (activeBiz.status) {
      case "published":
        state = "PUBLISHED";
        break;
      case "pending_review":
        state = "PENDING_REVIEW";
        break;
      case "rejected":
        state = "REJECTED";
        break;
      case "draft":
      default:
        state = "DRAFT";
        break;
    }

    console.log(`[Adaptive Dashboard] Active Business ID: ${activeBiz.id}, Name: "${activeBiz.name}", Status: '${activeBiz.status}', Resolved State: ${state}`);

    // Compute Health Score dynamically
    const healthScore: HealthScoreResult = calculateBusinessHealthScore(activeBiz);

    // Compute Draft completion if in DRAFT status
    let draftCompletion: DraftCompletionInfo | null = null;
    if (state === "DRAFT") {
      const missing: string[] = [];
      let stepCount = 0;

      if (activeBiz.name) stepCount += 1; else missing.push("Business Name");
      if (activeBiz.businessCategories && activeBiz.businessCategories.length > 0) stepCount += 1; else missing.push("Category Selection");
      if (activeBiz.contact && activeBiz.contact.primaryPhone) stepCount += 1; else missing.push("Contact Details");
      if (activeBiz.location && activeBiz.location.address) stepCount += 1; else missing.push("Location & Address");
      if (activeBiz.hours && activeBiz.hours.length > 0) stepCount += 1; else missing.push("Business Hours");
      if (activeBiz.documents && activeBiz.documents.length > 0) stepCount += 1; else missing.push("Verification Documents");

      const percentage = Math.round((stepCount / 6) * 100);
      draftCompletion = { percentage, missingSteps: missing };
    }

    // --- FAULT-ISOLATED OPTIONAL MODULE QUERIES ---

    // 1. In-App Notifications
    let userNotifications: any[] = [];
    try {
      userNotifications = await db.query.notifications.findMany({
        where: eq(notifications.userId, userId),
        orderBy: [desc(notifications.createdAt)],
        limit: 10,
      });
    } catch (notifErr) {
      console.warn("[Adaptive Dashboard] Notifications query skipped:", notifErr);
      userNotifications = [];
    }

    const unreadNotificationsCount = userNotifications.filter((n) => !n.read).length;

    // 2. Business Leads
    let leads: any[] = [];
    try {
      leads = await db.query.businessLeads.findMany({
        where: eq(businessLeads.businessId, activeBiz.id),
        orderBy: [desc(businessLeads.createdAt)],
        limit: 10,
      });
    } catch (leadsErr) {
      console.warn("[Adaptive Dashboard] Leads query skipped:", leadsErr);
      leads = [];
    }

    const unreadLeadsCount = leads.filter((l) => l.status === "new").length;

    // 3. Business Analytics
    let analyticsData: any = null;
    try {
      analyticsData = await db.query.businessAnalytics.findFirst({
        where: eq(businessAnalytics.businessId, activeBiz.id),
      });
    } catch (analyticsErr) {
      console.warn("[Adaptive Dashboard] Analytics query skipped:", analyticsErr);
      analyticsData = null;
    }

    // 4. Reviews summary
    let reviewsList: any[] = [];
    let avgRatingVal = 5.0;
    try {
      reviewsList = await db.query.reviews.findMany({
        where: eq(reviews.businessId, activeBiz.id),
        orderBy: [desc(reviews.createdAt)],
      });

      const approvedReviews = reviewsList.filter((r) => r.status === "approved");
      if (approvedReviews.length > 0) {
        const sum = approvedReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
        avgRatingVal = parseFloat((sum / approvedReviews.length).toFixed(1));
      }
    } catch (revErr) {
      console.warn("[Adaptive Dashboard] Reviews query skipped:", revErr);
      reviewsList = [];
    }

    // 5. Activity Timeline Audit Log from database
    let activities: ActivityTimelineItem[] = [];
    try {
      const dbActivities = await db.query.activityLogs.findMany({
        where: eq(activityLogs.businessId, activeBiz.id),
        orderBy: [desc(activityLogs.createdAt)],
        limit: 15,
      });

      activities = dbActivities.map((a) => ({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.description,
        time: new Date(a.createdAt),
      }));
    } catch (actErr) {
      console.warn("[Adaptive Dashboard] Activity logs query skipped:", actErr);
      activities = [];
    }

    // Fallback activity generation if database log table is empty
    if (activities.length === 0) {
      const createdAtDate = new Date(activeBiz.createdAt || Date.now());
      activities.push({
        id: `${activeBiz.id}-created`,
        type: "created",
        title: "Business Listing Created",
        description: `"${activeBiz.name}" was registered on BachatLal.`,
        time: createdAtDate,
      });
    }

    const metrics = {
      profileViews: analyticsData?.profileViews ?? 0,
      phoneClicks: analyticsData?.phoneClicks ?? 0,
      whatsappClicks: analyticsData?.whatsappClicks ?? 0,
      websiteClicks: analyticsData?.websiteClicks ?? 0,
      directionClicks: analyticsData?.directionClicks ?? 0,
      shareCount: analyticsData?.shareCount ?? 0,
      totalLeads: leads.length,
      unreadLeads: unreadLeadsCount,
      averageRating: avgRatingVal,
      reviewsCount: reviewsList.length,
    };

    console.log(`[Adaptive Dashboard] Loaded dashboard for ${activeBiz.name} (Health Score: ${healthScore.score}%)`);

    return {
      success: true,
      data: {
        state,
        user: session.user,
        businesses: ownerBusinesses,
        activeBusiness: activeBiz,
        draftCompletion,
        healthScore,
        metrics,
        leads,
        notifications: userNotifications,
        unreadNotificationsCount,
        activities,
        reviews: reviewsList,
      },
    };
  } catch (error: any) {
    console.error("[Adaptive Dashboard] Fatal error loading dashboard:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to load dashboard."),
    };
  }
}
