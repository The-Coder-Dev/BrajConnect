"use server";

import { db } from "@/db";
import { franchiseOpportunity, business, user, franchiseApplication } from "@/db/schema";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import { requireAuth, requireAdmin } from "@/lib/auth/guards";
import { randomUUID } from "crypto";
import { generateSlug } from "@/lib/slug/generate-slug";
import { franchiseOpportunitySchema, type FranchiseOpportunityInput } from "@/lib/validations/franchise/opportunity";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";

/**
 * Generate a unique slug for a franchise opportunity
 */
async function generateUniqueOpportunitySlug(title: string): Promise<string> {
  const base = generateSlug(title) || `franchise-${Date.now()}`;
  const existing = await db.query.franchiseOpportunity.findFirst({
    where: eq(franchiseOpportunity.slug, base),
  });
  if (!existing) return base;
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Business Owner: Create Franchise Opportunity for their approved business
 */
export async function createFranchiseOpportunity(rawInput: FranchiseOpportunityInput, submitForReview = false) {
  try {
    const { user: authUser } = await requireAuth();

    const parsed = franchiseOpportunitySchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input data" };
    }

    const data = parsed.data;

    // Verify business ownership
    const ownerBusiness = await db.query.business.findFirst({
      where: and(eq(business.id, data.businessId), eq(business.ownerId, authUser.id)),
    });

    if (!ownerBusiness) {
      return { success: false, error: "Unauthorized: You can only create opportunities for your own business." };
    }

    const id = `fo_${Date.now()}_${randomUUID().split("-")[0]}`;
    const slug = await generateUniqueOpportunitySlug(data.title);
    const initialStatus = submitForReview ? "pending_review" : "draft";

    await db.insert(franchiseOpportunity).values({
      id,
      businessId: data.businessId,
      ownerId: authUser.id,
      title: data.title,
      slug,
      description: data.description,

      franchiseFee: data.franchiseFee,
      estimatedInvestment: data.estimatedInvestment,
      investmentRange: data.investmentRange || null,
      expectedSetupCost: data.expectedSetupCost || null,

      availableState: data.availableState,
      availableCity: data.availableCity,
      preferredArea: data.preferredArea || null,
      territoryType: data.territoryType || null,

      minSpaceRequired: data.minSpaceRequired,
      experienceRequired: data.experienceRequired || null,
      eligibilityRequirements: data.eligibilityRequirements || null,
      availableUnits: data.availableUnits,

      trainingProvided: data.trainingProvided || null,
      marketingSupport: data.marketingSupport || null,
      operationalSupport: data.operationalSupport || null,
      initialSetupSupport: data.initialSetupSupport || null,

      agreementDuration: data.agreementDuration || null,
      renewalTerms: data.renewalTerms || null,

      termsConditions: data.termsConditions || null,
      requiredDocuments: data.requiredDocuments || null,

      status: initialStatus,
    });

    revalidatePath("/dashboard/franchise");
    revalidatePath("/franchise/opportunities");

    return { success: true, opportunityId: id, slug };
  } catch (error: any) {
    console.error("Failed to create franchise opportunity:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to create opportunity.") };
  }
}

/**
 * Business Owner: Fetch all opportunities created by this owner
 */
export async function getOwnerFranchiseOpportunities(businessId?: string) {
  try {
    const { user: authUser } = await requireAuth();

    const whereClause = businessId
      ? and(eq(franchiseOpportunity.ownerId, authUser.id), eq(franchiseOpportunity.businessId, businessId))
      : eq(franchiseOpportunity.ownerId, authUser.id);

    const items = await db.query.franchiseOpportunity.findMany({
      where: whereClause,
      with: {
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            status: true,
          },
        },
        applications: {
          columns: { id: true, status: true },
        },
      },
      orderBy: [desc(franchiseOpportunity.createdAt)],
    });

    return { success: true, data: items };
  } catch (error: any) {
    console.error("Failed to load owner opportunities:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to load opportunities.") };
  }
}

/**
 * Public & Partner: Get approved franchise opportunities with filters
 */
export async function getApprovedFranchiseOpportunities(params?: {
  search?: string;
  state?: string;
  city?: string;
}) {
  try {
    const conditions = [eq(franchiseOpportunity.status, "approved")];

    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      conditions.push(or(ilike(franchiseOpportunity.title, q), ilike(franchiseOpportunity.description, q)) as any);
    }

    if (params?.state && params.state !== "all") {
      conditions.push(eq(franchiseOpportunity.availableState, params.state));
    }

    if (params?.city && params.city !== "all") {
      conditions.push(ilike(franchiseOpportunity.availableCity, `%${params.city.trim()}%`));
    }

    const items = await db.query.franchiseOpportunity.findMany({
      where: and(...conditions),
      with: {
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            coverUrl: true,
            shortDescription: true,
          },
        },
      },
      orderBy: [desc(franchiseOpportunity.createdAt)],
    });

    return { success: true, data: items };
  } catch (error: any) {
    console.error("Failed to load approved opportunities:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to load opportunities.") };
  }
}

/**
 * Public & Partner: Get single opportunity by slug (only approved opportunities are publicly accessible)
 */
export async function getFranchiseOpportunityBySlug(slug: string) {
  try {
    const item = await db.query.franchiseOpportunity.findFirst({
      where: and(
        eq(franchiseOpportunity.slug, slug),
        eq(franchiseOpportunity.status, "approved")
      ),
      with: {
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            coverUrl: true,
            shortDescription: true,
            fullDescription: true,
            establishedYear: true,
          },
        },
      },
    });

    if (!item) {
      return { success: false, error: "Opportunity not found or not currently available." };
    }

    return { success: true, data: item };
  } catch (error: any) {
    console.error("Failed to load opportunity:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to load opportunity.") };
  }
}

/**
 * Business Owner: Submit draft opportunity for review
 */
export async function submitOpportunityForReview(opportunityId: string) {
  try {
    const { user: authUser } = await requireAuth();

    const existing = await db.query.franchiseOpportunity.findFirst({
      where: and(eq(franchiseOpportunity.id, opportunityId), eq(franchiseOpportunity.ownerId, authUser.id)),
    });

    if (!existing) {
      return { success: false, error: "Opportunity not found or unauthorized." };
    }

    await db.update(franchiseOpportunity)
      .set({ status: "pending_review", updatedAt: new Date() })
      .where(eq(franchiseOpportunity.id, opportunityId));

    revalidatePath("/dashboard/franchise");
    revalidatePath("/admin/franchise/opportunities");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit opportunity for review:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Failed to submit for review.") };
  }
}
