"use server";

import { db } from "@/db";
import { user, franchiseProfile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { franchiseRegisterSchema, type FranchiseRegisterInput } from "@/lib/validations/auth/franchise-register";
import { getFriendlyErrorMessage } from "@/lib/utils";

export async function completeFranchiseRegistration(rawInput: FranchiseRegisterInput) {
  const startTime = Date.now();
  console.log(`[FRANCHISE_REGISTRATION_START] Processing ${rawInput?.applicantType || "unknown"} franchise registration...`);

  try {
    // 1. Validate payload server-side
    const parsed = franchiseRegisterSchema.safeParse(rawInput);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid registration data";
      console.warn("[FRANCHISE_REGISTRATION_VALIDATION_FAILED]", errorMsg);
      return { success: false, error: errorMsg };
    }

    const data = parsed.data;

    // 2. Ensure user is authenticated via Better Auth session
    console.log("[FRANCHISE_SESSION_CHECK] Verifying active Better Auth session...");
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    
    if (!session?.user?.id) {
      console.warn("[FRANCHISE_SESSION_MISSING] No active session found during franchise profile completion.");
      return { success: false, error: "Session expired or unauthorized. Please log in and try again." };
    }

    const userId = session.user.id;
    console.log(`[FRANCHISE_SESSION_SUCCESS] User session active for ID: ${userId}`);

    // 3. Check if user already has a franchise profile
    const existingProfile = await db.query.franchiseProfile.findFirst({
      where: eq(franchiseProfile.userId, userId),
    });

    if (existingProfile) {
      console.log(`[FRANCHISE_PROFILE_EXISTS] Profile already exists for user ${userId}. Ensuring role is franchise_partner...`);
      await db.update(user)
        .set({ role: "franchise_partner", updatedAt: new Date() })
        .where(eq(user.id, userId));

      return { success: true, profileId: existingProfile.id };
    }

    const profileId = `fp_${Date.now()}_${randomUUID().split("-")[0]}`;

    // 4. Update user role to franchise_partner and create profile in transaction
    console.log(`[FRANCHISE_USER_ROLE_UPDATE] Setting role to franchise_partner and inserting profile ${profileId}...`);
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

    console.log(`[FRANCHISE_REGISTRATION_SUCCESS] Profile ${profileId} created successfully in ${Date.now() - startTime}ms`);
    return { success: true, profileId };
  } catch (error: unknown) {
    console.error("[FRANCHISE_REGISTRATION_ERROR]", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to complete franchise registration. Please try again."),
    };
  }
}
