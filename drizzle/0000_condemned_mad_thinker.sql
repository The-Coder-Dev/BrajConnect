CREATE TYPE "public"."user_role" AS ENUM('visitor', 'business_owner', 'admin');--> statement-breakpoint
CREATE TYPE "public"."business_status" AS ENUM('draft', 'pending_review', 'published', 'rejected', 'suspended', 'archived');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('not_submitted', 'pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."social_platform" AS ENUM('website', 'instagram', 'facebook', 'linkedin', 'youtube', 'x', 'whatsapp', 'telegram');--> statement-breakpoint
CREATE TYPE "public"."preferred_contact_method" AS ENUM('phone', 'whatsapp', 'email');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('gst', 'pan', 'registration_certificate', 'trade_license', 'other');--> statement-breakpoint
CREATE TYPE "public"."input_type" AS ENUM('text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'date', 'switch');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'visitor' NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"description" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "business" (
	"id" text PRIMARY KEY NOT NULL,
	"ownerId" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"shortDescription" text,
	"fullDescription" text,
	"establishedYear" integer,
	"logoUrl" text,
	"logoPublicId" text,
	"coverUrl" text,
	"coverPublicId" text,
	"status" "business_status" DEFAULT 'draft' NOT NULL,
	"verificationStatus" "verification_status" DEFAULT 'not_submitted' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"publishedAt" timestamp,
	"deletedAt" timestamp,
	CONSTRAINT "business_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"district" text,
	"city" text NOT NULL,
	"locality" text,
	"postalCode" text NOT NULL,
	"address" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"formattedAddress" text,
	"googlePlaceId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "location_businessId_unique" UNIQUE("businessId")
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"imageUrl" text NOT NULL,
	"cloudinaryPublicId" text NOT NULL,
	"format" text,
	"bytes" integer,
	"altText" text,
	"width" integer,
	"height" integer,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"isCover" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"platform" "social_platform" NOT NULL,
	"url" text NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcategory" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "subcategory_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "business_category" (
	"businessId" text NOT NULL,
	"categoryId" text NOT NULL,
	"isPrimary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "business_category_businessId_categoryId_pk" PRIMARY KEY("businessId","categoryId")
);
--> statement-breakpoint
CREATE TABLE "business_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"primaryPhone" text,
	"secondaryPhone" text,
	"whatsapp" text,
	"email" text,
	"website" text,
	"preferredContactMethod" "preferred_contact_method",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_contact_businessId_unique" UNIQUE("businessId")
);
--> statement-breakpoint
CREATE TABLE "business_hours" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"dayOfWeek" integer NOT NULL,
	"openTime" text,
	"closeTime" text,
	"isClosed" boolean DEFAULT false NOT NULL,
	"is24Hours" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_day_unique" UNIQUE("businessId","dayOfWeek")
);
--> statement-breakpoint
CREATE TABLE "business_services" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "business_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"documentType" "document_type" NOT NULL,
	"fileName" text NOT NULL,
	"storagePath" text NOT NULL,
	"mimeType" text NOT NULL,
	"verificationStatus" "verification_status" DEFAULT 'not_submitted' NOT NULL,
	"rejectionReason" text,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "business_amenities" (
	"businessId" text NOT NULL,
	"amenityId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_amenities_businessId_amenityId_pk" PRIMARY KEY("businessId","amenityId")
);
--> statement-breakpoint
CREATE TABLE "dynamic_fields" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"label" text NOT NULL,
	"key" text NOT NULL,
	"inputType" "input_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"placeholder" text,
	"defaultValue" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"options" jsonb,
	"helpText" text,
	"validationMetadata" jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_fields" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"dynamicFieldId" text NOT NULL,
	"value" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social" ADD CONSTRAINT "social_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_category" ADD CONSTRAINT "business_category_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_category" ADD CONSTRAINT "business_category_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_contact" ADD CONSTRAINT "business_contact_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_services" ADD CONSTRAINT "business_services_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_documents" ADD CONSTRAINT "business_documents_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_amenities" ADD CONSTRAINT "business_amenities_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_amenities" ADD CONSTRAINT "business_amenities_amenityId_amenities_id_fk" FOREIGN KEY ("amenityId") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dynamic_fields" ADD CONSTRAINT "dynamic_fields_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_fields" ADD CONSTRAINT "business_fields_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_fields" ADD CONSTRAINT "business_fields_dynamicFieldId_dynamic_fields_id_fk" FOREIGN KEY ("dynamicFieldId") REFERENCES "public"."dynamic_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_active_idx" ON "category" USING btree ("active");--> statement-breakpoint
CREATE INDEX "category_sort_order_idx" ON "category" USING btree ("sortOrder");--> statement-breakpoint
CREATE INDEX "name_idx" ON "business" USING btree ("name");--> statement-breakpoint
CREATE INDEX "status_idx" ON "business" USING btree ("status");--> statement-breakpoint
CREATE INDEX "featured_idx" ON "business" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "location_business_id_idx" ON "location" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "location_city_idx" ON "location" USING btree ("city");--> statement-breakpoint
CREATE INDEX "location_district_idx" ON "location" USING btree ("district");--> statement-breakpoint
CREATE INDEX "gallery_business_id_idx" ON "gallery" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "social_business_id_idx" ON "social" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "subcategory_category_id_idx" ON "subcategory" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "contact_business_id_idx" ON "business_contact" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "hours_business_id_idx" ON "business_hours" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "services_business_id_idx" ON "business_services" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "documents_business_id_idx" ON "business_documents" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "amenities_active_idx" ON "amenities" USING btree ("active");--> statement-breakpoint
CREATE INDEX "dynamic_fields_category_id_idx" ON "dynamic_fields" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "business_fields_business_id_idx" ON "business_fields" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "business_fields_dynamic_field_id_idx" ON "business_fields" USING btree ("dynamicFieldId");