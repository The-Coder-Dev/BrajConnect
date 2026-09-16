"use server";

import { db } from "@/db";
import { franchiseUnit } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireFranchisePartner } from "@/lib/auth/guards";
import { getFriendlyErrorMessage } from "@/lib/utils";

export async function getPartnerFranchiseUnits() {
  try {
    const { user: authUser } = await requireFranchisePartner();

    const units = await db.query.franchiseUnit.findMany({
      where: eq(franchiseUnit.franchisePartnerId, authUser.id),
      with: {
        business: {
          columns: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            coverUrl: true,
          },
        },
        opportunity: {
          columns: {
            id: true,
            title: true,
            slug: true,
            territoryType: true,
            minSpaceRequired: true,
            franchiseFee: true,
          },
        },
        application: {
          columns: {
            id: true,
            applicantType: true,
            applicantName: true,
            preferredLocation: true,
            investmentCapacity: true,
            createdAt: true,
          },
        },
      },
      orderBy: [desc(franchiseUnit.createdAt)],
    });

    return { success: true, data: units };
  } catch (error: any) {
    console.error("Failed to load partner franchise units:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to load franchise units."),
    };
  }
}
