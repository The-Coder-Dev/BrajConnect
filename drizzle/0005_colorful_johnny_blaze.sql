CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."franchise_applicant_type" AS ENUM('individual', 'company');--> statement-breakpoint
CREATE TYPE "public"."franchise_opportunity_status" AS ENUM('draft', 'pending_review', 'approved', 'rejected', 'closed');--> statement-breakpoint
CREATE TYPE "public"."franchise_application_status" AS ENUM('submitted', 'under_review', 'approved', 'rejected', 'withdrawn');--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'franchise_partner' BEFORE 'admin';--> statement-breakpoint
CREATE TABLE "business_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"ownerId" text NOT NULL,
	"visitorName" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"preferredContact" text DEFAULT 'phone',
	"subject" text,
	"message" text NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"businessId" text,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"link" text,
	"read" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"profileViews" integer DEFAULT 0 NOT NULL,
	"phoneClicks" integer DEFAULT 0 NOT NULL,
	"whatsappClicks" integer DEFAULT 0 NOT NULL,
	"websiteClicks" integer DEFAULT 0 NOT NULL,
	"directionClicks" integer DEFAULT 0 NOT NULL,
	"shareCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_analytics_businessId_unique" UNIQUE("businessId")
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text,
	"userId" text,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"userId" text,
	"authorName" text NOT NULL,
	"authorEmail" text NOT NULL,
	"authorAvatar" text,
	"rating" integer DEFAULT 5 NOT NULL,
	"comment" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"ownerResponse" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_category_details" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"categoryId" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_category_details_businessId_unique" UNIQUE("businessId")
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"businessId" text,
	"recipientEmail" text NOT NULL,
	"event" text NOT NULL,
	"status" text NOT NULL,
	"providerMessageId" text,
	"error" text,
	"sentAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "franchise_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"applicantType" "franchise_applicant_type" NOT NULL,
	"fullName" text,
	"mobileNumber" text,
	"currentOccupation" text,
	"previousExperience" text,
	"reasonForApplying" text,
	"companyName" text,
	"companyEmail" text,
	"companyPhone" text,
	"companyWebsite" text,
	"gstNumber" text,
	"panNumber" text,
	"companyDescription" text,
	"authorizedPersonName" text,
	"authorizedPersonDesignation" text,
	"authorizedPersonEmail" text,
	"authorizedPersonPhone" text,
	"preferredState" text NOT NULL,
	"preferredCity" text NOT NULL,
	"investmentCapacity" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "franchise_profiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "franchise_opportunities" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"ownerId" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"franchiseFee" text NOT NULL,
	"estimatedInvestment" text NOT NULL,
	"investmentRange" text,
	"expectedSetupCost" text,
	"availableState" text NOT NULL,
	"availableCity" text NOT NULL,
	"preferredArea" text,
	"territoryType" text,
	"minSpaceRequired" text NOT NULL,
	"experienceRequired" text,
	"eligibilityRequirements" text,
	"availableUnits" integer DEFAULT 1 NOT NULL,
	"trainingProvided" text,
	"marketingSupport" text,
	"operationalSupport" text,
	"initialSetupSupport" text,
	"agreementDuration" text,
	"renewalTerms" text,
	"termsConditions" text,
	"requiredDocuments" text,
	"status" "franchise_opportunity_status" DEFAULT 'draft' NOT NULL,
	"rejectionReason" text,
	"approvedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "franchise_opportunities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "franchise_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"opportunityId" text NOT NULL,
	"businessId" text NOT NULL,
	"franchisePartnerId" text NOT NULL,
	"applicantType" "franchise_applicant_type" NOT NULL,
	"applicantName" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"preferredLocation" text NOT NULL,
	"investmentCapacity" text NOT NULL,
	"businessExperience" text,
	"relevantExperience" text,
	"whyInterested" text,
	"additionalComments" text,
	"documentUrl" text,
	"status" "franchise_application_status" DEFAULT 'submitted' NOT NULL,
	"reviewNotes" text,
	"reviewedBy" text,
	"reviewedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_leads" ADD CONSTRAINT "business_leads_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_leads" ADD CONSTRAINT "business_leads_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_analytics" ADD CONSTRAINT "business_analytics_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_category_details" ADD CONSTRAINT "business_category_details_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_category_details" ADD CONSTRAINT "business_category_details_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_profiles" ADD CONSTRAINT "franchise_profiles_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_opportunities" ADD CONSTRAINT "franchise_opportunities_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_opportunities" ADD CONSTRAINT "franchise_opportunities_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_applications" ADD CONSTRAINT "franchise_applications_opportunityId_franchise_opportunities_id_fk" FOREIGN KEY ("opportunityId") REFERENCES "public"."franchise_opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_applications" ADD CONSTRAINT "franchise_applications_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_applications" ADD CONSTRAINT "franchise_applications_franchisePartnerId_user_id_fk" FOREIGN KEY ("franchisePartnerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_applications" ADD CONSTRAINT "franchise_applications_reviewedBy_user_id_fk" FOREIGN KEY ("reviewedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "biz_cat_details_biz_id_idx" ON "business_category_details" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "biz_cat_details_cat_id_idx" ON "business_category_details" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "franchise_profile_user_id_idx" ON "franchise_profiles" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "franchise_profile_applicant_type_idx" ON "franchise_profiles" USING btree ("applicantType");--> statement-breakpoint
CREATE INDEX "fo_business_id_idx" ON "franchise_opportunities" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "fo_owner_id_idx" ON "franchise_opportunities" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "fo_status_idx" ON "franchise_opportunities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "fo_slug_idx" ON "franchise_opportunities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "fo_location_idx" ON "franchise_opportunities" USING btree ("availableState","availableCity");--> statement-breakpoint
CREATE INDEX "fa_opportunity_id_idx" ON "franchise_applications" USING btree ("opportunityId");--> statement-breakpoint
CREATE INDEX "fa_business_id_idx" ON "franchise_applications" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "fa_partner_id_idx" ON "franchise_applications" USING btree ("franchisePartnerId");--> statement-breakpoint
CREATE INDEX "fa_status_idx" ON "franchise_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "business" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "activity_biz_idx" ON "business_activity" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "activity_created_at_idx" ON "business_activity" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "review_biz_idx" ON "business_review" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "reviewed_at_idx" ON "business_review" USING btree ("reviewedAt");