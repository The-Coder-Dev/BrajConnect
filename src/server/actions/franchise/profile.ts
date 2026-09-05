"use server";

import { db } from "@/db";
import { franchiseProfile, franchiseApplication, user } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { requireFranchisePartner } from "@/lib/auth/guards";
import { getFriendlyErrorMessage } from "@/lib/utils";

export async function getFranchiseDashboardData() {
  try {
    const { user: authUser } = await requireFranchisePartner();

    // 1. Fetch franchise profile
    const profile = await db.query.franchiseProfile.findFirst({
      where: eq(franchiseProfile.userId, authUser.id),
    });

    // 2. Fetch applications with opportunity & business details
    const applications = await db.query.franchiseApplication.findMany({
      where: eq(franchiseApplication.franchisePartnerId, authUser.id),
      with: {
        opportunity: true,
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            status: true,
          },
        },
      },
      orderBy: (apps, { desc }) => [desc(apps.createdAt)],
    });

    // 3. Compute stats
    const totalApplications = applications.length;
    const underReview = applications.filter((a) => a.status === "under_review" || a.status === "submitted").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    return {
      success: true,
      data: {
        user: authUser,
        profile,
        stats: {
          total: totalApplications,
          underReview,
          approved,
          rejected,
        },
        recentApplications: applications.slice(0, 5),
        allApplications: applications,
      },
    };
  } catch (error: any) {
    console.error("Failed to load franchise dashboard data:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to load dashboard data."),
    };
  }
}
