"use server";

import { db } from "@/db";
import { franchiseApplication, franchiseOpportunity, franchiseProfile, business, user } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, requireAdmin, requireFranchisePartner } from "@/lib/auth/guards";
import { randomUUID } from "crypto";
import { franchiseApplicationSchema, type FranchiseApplicationInput } from "@/lib/validations/franchise/application";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";

/**
 * Franchise Partner: Submit Application for an Approved Opportunity
 */
export async function submitFranchiseApplication(rawInput: FranchiseApplicationInput) {
  try {
    const { user: authUser } = await requireFranchisePartner();

    const parsed = franchiseApplicationSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid application data" };
    }

    const data = parsed.data;

    // 1. Fetch partner profile
    const profile = await db.query.franchiseProfile.findFirst({
      where: eq(franchiseProfile.userId, authUser.id),
    });

    if (!profile) {
      return { success: false, error: "Please complete your Franchise Partner profile before applying." };
    }

    // 2. Fetch opportunity
    const opp = await db.query.franchiseOpportunity.findFirst({
      where: eq(franchiseOpportunity.id, data.opportunityId),
    });

    if (!opp || opp.status !== "approved") {
      return { success: false, error: "This franchise opportunity is not currently available for applications." };
    }

    // 3. Check for existing active application
    const existing = await db.query.franchiseApplication.findFirst({
      where: and(
        eq(franchiseApplication.opportunityId, data.opportunityId),
        eq(franchiseApplication.franchisePartnerId, authUser.id)
      ),
    });

    if (existing) {
      return { success: false, error: "You have already submitted an application for this opportunity." };
    }

    // 4. Determine applicant display details based on applicantType
    const isCompany = profile.applicantType === "company";
    const applicantName = isCompany 
      ? (profile.companyName || authUser.name || "Company Applicant") 
      : (profile.fullName || authUser.name || "Individual Applicant");
    const email = isCompany ? (profile.companyEmail || authUser.email) : authUser.email;
    const phone = isCompany ? (profile.companyPhone || profile.authorizedPersonPhone || "") : (profile.mobileNumber || "");

    const applicationId = `fa_${Date.now()}_${randomUUID().split("-")[0]}`;

    await db.insert(franchiseApplication).values({
      id: applicationId,
      opportunityId: opp.id,
      businessId: opp.businessId,
      franchisePartnerId: authUser.id,
      applicantType: profile.applicantType,
      applicantName,
      email,
      phone,
      preferredLocation: data.preferredLocation,
      investmentCapacity: data.investmentCapacity,
      businessExperience: data.businessExperience || profile.previousExperience || null,
      relevantExperience: data.relevantExperience || null,
      whyInterested: data.whyInterested || profile.reasonForApplying || null,
      additionalComments: data.additionalComments || null,
      documentUrl: data.documentUrl || null,
      status: "submitted",
    });

    revalidatePath("/franchise/dashboard");
    revalidatePath("/franchise/applications");
    revalidatePath("/dashboard/franchise/applications");

    return { success: true, applicationId };
  } catch (error: any) {
    console.error("Failed to submit franchise application:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to submit application.") };
  }
}

/**
 * Franchise Partner: Get their own submitted applications
 */
export async function getPartnerApplications() {
  try {
    const { user: authUser } = await requireFranchisePartner();

    const items = await db.query.franchiseApplication.findMany({
      where: eq(franchiseApplication.franchisePartnerId, authUser.id),
      with: {
        opportunity: true,
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
      orderBy: [desc(franchiseApplication.createdAt)],
    });

    return { success: true, data: items };
  } catch (error: any) {
    console.error("Failed to load partner applications:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to load applications.") };
  }
}

/**
 * Business Owner: Get all applications received for their businesses
 */
export async function getBusinessOwnerApplications() {
  try {
    const { user: authUser } = await requireAuth();

    // Find all businesses owned by user
    const ownerBusinesses = await db.query.business.findMany({
      where: eq(business.ownerId, authUser.id),
      columns: { id: true },
    });

    if (ownerBusinesses.length === 0) {
      return { success: true, data: [] };
    }

    const businessIds = ownerBusinesses.map((b) => b.id);

    const items = await db.query.franchiseApplication.findMany({
      where: (apps, { inArray }) => inArray(apps.businessId, businessIds),
      with: {
        opportunity: true,
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        franchisePartner: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [desc(franchiseApplication.createdAt)],
    });

    return { success: true, data: items };
  } catch (error: any) {
    console.error("Failed to load business owner applications:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to load applications.") };
  }
}

/**
 * Business Owner or Admin: Update application status (under_review, approved, rejected)
 */
export async function updateApplicationStatus(params: {
  applicationId: string;
  status: "under_review" | "approved" | "rejected";
  reviewNotes?: string;
}) {
  try {
    const { user: authUser } = await requireAuth();

    const app = await db.query.franchiseApplication.findFirst({
      where: eq(franchiseApplication.id, params.applicationId),
      with: {
        business: {
          columns: { ownerId: true },
        },
      },
    });

    if (!app) {
      return { success: false, error: "Application not found" };
    }

    const isOwner = app.business.ownerId === authUser.id;
    const isAdmin = authUser.role === "admin";

    if (!isOwner && !isAdmin) {
      return { success: false, error: "Unauthorized to update this application." };
    }

    await db.update(franchiseApplication)
      .set({
        status: params.status,
        reviewNotes: params.reviewNotes || null,
        reviewedBy: authUser.id,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(franchiseApplication.id, params.applicationId));

    revalidatePath("/dashboard/franchise/applications");
    revalidatePath("/franchise/applications");
    revalidatePath("/admin/franchise/applications");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update application status:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to update application status.") };
  }
}

/**
 * Admin: Moderate Opportunity (approve or reject)
 */
export async function adminModerateOpportunity(params: {
  opportunityId: string;
  action: "approved" | "rejected";
  reason?: string;
}) {
  try {
    await requireAdmin();

    const existing = await db.query.franchiseOpportunity.findFirst({
      where: eq(franchiseOpportunity.id, params.opportunityId),
    });

    if (!existing) {
      return { success: false, error: "Opportunity not found" };
    }

    if (params.action === "approved") {
      await db.update(franchiseOpportunity)
        .set({
          status: "approved",
          rejectionReason: null,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(franchiseOpportunity.id, params.opportunityId));
    } else {
      await db.update(franchiseOpportunity)
        .set({
          status: "rejected",
          rejectionReason: params.reason || "Submission does not meet platform requirements.",
          updatedAt: new Date(),
        })
        .where(eq(franchiseOpportunity.id, params.opportunityId));
    }

    revalidatePath("/admin/franchise/opportunities");
    revalidatePath("/franchise/opportunities");
    revalidatePath("/dashboard/franchise");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to moderate opportunity:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to moderate opportunity.") };
  }
}

/**
 * Admin: Get all franchise opportunities with status filter
 */
export async function getAdminOpportunities(status?: string) {
  try {
    await requireAdmin();

    const whereClause = status && status !== "all" 
      ? eq(franchiseOpportunity.status, status as any)
      : undefined;

    const items = await db.query.franchiseOpportunity.findMany({
      where: whereClause,
      with: {
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
            status: true,
            verificationStatus: true,
          },
        },
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        applications: {
          columns: { id: true },
        },
      },
      orderBy: [desc(franchiseOpportunity.createdAt)],
    });

    return { success: true, data: items };
  } catch (error: any) {
    console.error("Failed to load admin opportunities:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to load opportunities.") };
  }
}

/**
 * Admin: Get all franchise applications platform-wide
 */
export async function getAdminAllApplications(status?: string) {
  try {
    await requireAdmin();

    const whereClause = status && status !== "all"
      ? eq(franchiseApplication.status, status as any)
      : undefined;

    const items = await db.query.franchiseApplication.findMany({
      where: whereClause,
      with: {
        opportunity: true,
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
        franchisePartner: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [desc(franchiseApplication.createdAt)],
    });

    return { success: true, data: items };
  } catch (error: any) {
    console.error("Failed to load admin applications:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to load applications.") };
  }
}
