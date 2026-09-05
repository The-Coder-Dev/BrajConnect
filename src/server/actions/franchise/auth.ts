"use server";

import { db } from "@/db";
import { user, franchiseProfile, session as sessionTable, account as accountTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { franchiseRegisterSchema, type FranchiseRegisterInput } from "@/lib/validations/auth/franchise-register";
import { getFriendlyErrorMessage } from "@/lib/utils";

export type FranchiseAuthResponse = {
  success: boolean;
  message: string;
  redirectTo?: string;
  profileId?: string;
  error?: string;
};

export async function completeFranchiseRegistration(rawInput: FranchiseRegisterInput): Promise<FranchiseAuthResponse> {
  let createdUserId: string | null = null;

  try {
    // 1. Validate payload server-side
    const parsed = franchiseRegisterSchema.safeParse(rawInput);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Please check the highlighted fields.";
      return { 
        success: false, 
        message: "Please check the highlighted fields.", 
        error: errorMsg 
      };
    }

    const data = parsed.data;

    // 2. Ensure user is authenticated via Better Auth session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { 
        success: false, 
        message: "Session expired or unauthorized. Please try again." 
      };
    }

    const userId = session.user.id;
    createdUserId = userId;

    // 3. Check if user already has a franchise profile
    const existingProfile = await db.query.franchiseProfile.findFirst({
      where: eq(franchiseProfile.userId, userId),
    });

    if (existingProfile) {
      // Profile already created, just ensure role is franchise_partner
      await db.update(user)
        .set({ role: "franchise_partner", updatedAt: new Date() })
        .where(eq(user.id, userId));

      return { 
        success: true, 
        message: "Franchise account created successfully.", 
        redirectTo: "/franchise/dashboard",
        profileId: existingProfile.id 
      };
    }

    const profileId = `fp_${Date.now()}_${randomUUID().split("-")[0]}`;

    // 4. Update user role to franchise_partner and create profile inside an atomic transaction
    await db.transaction(async (tx) => {
      // Server strictly assigns the role 'franchise_partner'
      await tx.update(user)
        .set({
          role: "franchise_partner",
          updatedAt: new Date()
        })
        .where(eq(user.id, userId));

      if (data.applicantType === "individual") {
        await tx.insert(franchiseProfile).values({
          id: profileId,
          userId,
          applicantType: "individual",
          fullName: data.fullName,
          mobileNumber: data.mobileNumber,
          preferredState: data.preferredState,
          preferredCity: data.preferredCity,
          investmentCapacity: data.investmentCapacity,
          previousExperience: data.previousExperience || null,
          currentOccupation: data.currentOccupation || null,
          reasonForApplying: data.reasonForApplying || null,
        });
      } else {
        await tx.insert(franchiseProfile).values({
          id: profileId,
          userId,
          applicantType: "company",
          companyName: data.companyName,
          companyEmail: data.companyEmail,
          companyPhone: data.companyPhone,
          companyWebsite: data.companyWebsite || null,
          gstNumber: data.gstNumber || null,
          panNumber: data.panNumber || null,
          companyDescription: data.companyDescription || null,
          authorizedPersonName: data.authorizedPersonName,
          authorizedPersonDesignation: data.authorizedPersonDesignation,
          authorizedPersonEmail: data.authorizedPersonEmail,
          authorizedPersonPhone: data.authorizedPersonPhone,
          preferredState: data.preferredState,
          preferredCity: data.preferredCity,
          investmentCapacity: data.investmentCapacity,
        });
      }
    });

    return { 
      success: true, 
      message: "Franchise account created successfully.", 
      redirectTo: "/franchise/dashboard",
      profileId 
    };
  } catch (error: any) {
    console.error("Failed to complete franchise registration:", error);

    // Rollback cleanup: Prevent orphaned partial user accounts if profile creation failed
    if (createdUserId) {
      try {
        console.warn(`Rolling back partial franchise account for user ${createdUserId}`);
        await db.delete(franchiseProfile).where(eq(franchiseProfile.userId, createdUserId));
        await db.delete(sessionTable).where(eq(sessionTable.userId, createdUserId));
        await db.delete(accountTable).where(eq(accountTable.userId, createdUserId));
        await db.delete(user).where(eq(user.id, createdUserId));
      } catch (cleanupErr) {
        console.error("Error during partial account cleanup rollback:", cleanupErr);
      }
    }

    return {
      success: false,
      message: "We couldn't create your account right now. Please try again.",
      error: getFriendlyErrorMessage(error, "We couldn't create your account right now. Please try again."),
    };
  }
}
