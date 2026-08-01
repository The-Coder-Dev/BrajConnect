import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export interface OwnershipVerificationOptions {
  forbiddenStatuses?: string[];
  allowedStatuses?: string[];
}

export interface OwnershipVerificationResult {
  authorized: boolean;
  business?: {
    id: string;
    ownerId: string;
    status: string;
  };
  error?: string;
  statusCode?: number;
}

/**
 * Task 3: Centralized Business Ownership & State Verification Helper.
 * Reused across API upload routes and server actions to avoid duplicate authorization logic.
 */
export async function verifyBusinessOwnership(
  businessId: string,
  ownerId: string,
  options: OwnershipVerificationOptions = {}
): Promise<OwnershipVerificationResult> {
  if (!businessId || typeof businessId !== "string" || businessId.trim() === "") {
    return { authorized: false, error: "Business ID is required.", statusCode: 400 };
  }

  if (!ownerId || typeof ownerId !== "string" || ownerId.trim() === "") {
    return { authorized: false, error: "Unauthorized user.", statusCode: 401 };
  }

  try {
    const biz = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, ownerId)),
      columns: {
        id: true,
        ownerId: true,
        status: true,
      },
    });

    if (!biz) {
      return {
        authorized: false,
        error: "Business not found or access denied.",
        statusCode: 403,
      };
    }

    const forbidden = options.forbiddenStatuses || ["archived", "suspended"];
    if (forbidden.includes(biz.status)) {
      return {
        authorized: false,
        error: `Business status '${biz.status}' does not allow this operation.`,
        statusCode: 400,
      };
    }

    if (options.allowedStatuses && !options.allowedStatuses.includes(biz.status)) {
      return {
        authorized: false,
        error: `Operation not allowed for business in '${biz.status}' state.`,
        statusCode: 400,
      };
    }

    return {
      authorized: true,
      business: biz,
    };
  } catch (error) {
    console.error(`[Security Ownership] Failed to verify ownership for business '${businessId}':`, error);
    return {
      authorized: false,
      error: "Failed to verify business authorization.",
      statusCode: 500,
    };
  }
}
