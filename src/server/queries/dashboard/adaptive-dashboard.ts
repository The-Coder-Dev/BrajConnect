"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { business, businessLeads, notifications, businessAnalytics } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";

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
  type: "created" | "updated" | "submitted" | "published" | "rejected" | "lead" | "review";
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
      console.log(`[Adaptive Dashboard] Notifications loaded: ${userNotifications.length} items`);
    } catch (notifErr) {
      console.warn("[Adaptive Dashboard] Notifications query skipped (table missing or unmigrated):", notifErr);
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
      console.log(`[Adaptive Dashboard] Business leads loaded: ${leads.length} items`);
    } catch (leadsErr) {
      console.warn("[Adaptive Dashboard] Leads query skipped (table missing or unmigrated):", leadsErr);
      leads = [];
    }

    const unreadLeadsCount = leads.filter((l) => l.status === "new").length;

    // 3. Business Analytics
    let analyticsData: any = null;
    try {
      analyticsData = await db.query.businessAnalytics.findFirst({
        where: eq(businessAnalytics.businessId, activeBiz.id),
      });
      console.log("[Adaptive Dashboard] Business analytics loaded:", analyticsData ? "Found" : "Default");
    } catch (analyticsErr) {
      console.warn("[Adaptive Dashboard] Analytics query skipped (table missing or unmigrated):", analyticsErr);
      analyticsData = null;
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
      averageRating: 4.8,
      reviewsCount: 12,
    };

    // --- ACTIVITY AUDIT TIMELINE GENERATION ---
    const activities: ActivityTimelineItem[] = [];

    const createdAtDate = new Date(activeBiz.createdAt || Date.now());
    const updatedAtDate = new Date(activeBiz.updatedAt || Date.now());

    // Created event
    activities.push({
      id: `${activeBiz.id}-created`,
      type: "created",
      title: "Business Draft Created",
      description: `"${activeBiz.name}" was initially registered.`,
      time: createdAtDate,
    });

    // Updates
    if (updatedAtDate.getTime() - createdAtDate.getTime() > 10000) {
      activities.push({
        id: `${activeBiz.id}-updated`,
        type: "updated",
        title: "Profile Updated",
        description: `"${activeBiz.name}" details were edited.`,
        time: updatedAtDate,
      });
    }

    // Status transition events
    if (activeBiz.status === "pending_review") {
      activities.push({
        id: `${activeBiz.id}-submitted`,
        type: "submitted",
        title: "Submitted for Review",
        description: `"${activeBiz.name}" is undergoing manual verification.`,
        time: updatedAtDate,
      });
    } else if (activeBiz.status === "published") {
      const publishedDate = new Date(activeBiz.publishedAt || activeBiz.updatedAt || Date.now());
      activities.push({
        id: `${activeBiz.id}-published`,
        type: "published",
        title: "Business Approved & Published",
        description: `"${activeBiz.name}" is live on BachatLal.`,
        time: publishedDate,
      });
    } else if (activeBiz.status === "rejected") {
      activities.push({
        id: `${activeBiz.id}-rejected`,
        type: "rejected",
        title: "Submission Rejected",
        description: `Reason: ${activeBiz.rejectionReason || "Verification criteria incomplete."}`,
        time: updatedAtDate,
      });
    }

    // Add Lead events to activity timeline safely
    (leads || []).forEach((l) => {
      if (l && l.id) {
        activities.push({
          id: `act-${l.id}`,
          type: "lead",
          title: "Lead Received",
          description: `${l.visitorName || "A visitor"} submitted a contact inquiry.`,
          time: new Date(l.createdAt || Date.now()),
        });
      }
    });

    // Sort timeline desc safely
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    console.log(`[Adaptive Dashboard] Dashboard loaded successfully for business ${activeBiz.id}`);

    return {
      success: true,
      data: {
        state,
        user: session.user,
        businesses: ownerBusinesses,
        activeBusiness: activeBiz,
        draftCompletion,
        metrics,
        leads,
        notifications: userNotifications,
        unreadNotificationsCount,
        activities: activities.slice(0, 10),
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
