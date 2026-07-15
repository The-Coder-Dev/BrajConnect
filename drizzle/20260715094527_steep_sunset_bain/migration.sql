CREATE TYPE "user_role" AS ENUM('visitor', 'business_owner', 'admin');--> statement-breakpoint
CREATE TYPE "business_status" AS ENUM('draft', 'pending_review', 'published', 'rejected', 'suspended', 'archived');--> statement-breakpoint
CREATE TYPE "verification_status" AS ENUM('not_submitted', 'pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "social_platform" AS ENUM('website', 'instagram', 'facebook', 'linkedin', 'youtube', 'x', 'whatsapp', 'telegram');--> statement-breakpoint
CREATE TYPE "document_type" AS ENUM('gst', 'pan', 'registration_certificate', 'trade_license', 'other');--> statement-breakpoint
CREATE TYPE "input_type" AS ENUM('text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'date');--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"icon" text,
	"description" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "business" (
	"id" text PRIMARY KEY,
	"ownerId" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"shortDescription" text,
	"fullDescription" text,
	"establishedYear" integer,
	"logoUrl" text,
	"logoPublicId" text,
	"coverUrl" text,
	"coverPublicId" text,
	"status" "business_status" DEFAULT 'draft'::"business_status" NOT NULL,
	"verificationStatus" "verification_status" DEFAULT 'not_submitted'::"verification_status" NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" text PRIMARY KEY,
	"businessId" text NOT NULL UNIQUE,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"district" text,
	"city" text NOT NULL,
	"locality" text,
	"postalCode" text NOT NULL,
	"address" text NOT NULL,
	"latitude" text,
	"longitude" text,
	"formattedAddress" text,
	"googlePlaceId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" text PRIMARY KEY,
	"businessId" text NOT NULL,
	"imageUrl" text NOT NULL,
	"cloudinaryPublicId" text NOT NULL,
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
	"id" text PRIMARY KEY,
	"businessId" text NOT NULL,
	"platform" "social_platform" NOT NULL,
	"url" text NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcategory" (
	"id" text PRIMARY KEY,
	"categoryId" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "business_category" (
	"businessId" text,
	"categoryId" text,
	"isPrimary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "business_category_pkey" PRIMARY KEY("businessId","categoryId")
);
--> statement-breakpoint
CREATE TABLE "business_contact" (
	"id" text PRIMARY KEY,
	"businessId" text NOT NULL UNIQUE,
	"primaryPhone" text,
	"secondaryPhone" text,
	"whatsapp" text,
	"email" text,
	"website" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_hours" (
	"id" text PRIMARY KEY,
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
	"id" text PRIMARY KEY,
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
	"id" text PRIMARY KEY,
	"businessId" text NOT NULL,
	"documentType" "document_type" NOT NULL,
	"fileName" text NOT NULL,
	"storagePath" text NOT NULL,
	"mimeType" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"icon" text,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "business_amenities" (
	"businessId" text,
	"amenityId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_amenities_pkey" PRIMARY KEY("businessId","amenityId")
);
--> statement-breakpoint
CREATE TABLE "dynamic_fields" (
	"id" text PRIMARY KEY,
	"categoryId" text NOT NULL,
	"label" text NOT NULL,
	"key" text NOT NULL,
	"inputType" "input_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"placeholder" text,
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
	"id" text PRIMARY KEY,
	"businessId" text NOT NULL,
	"dynamicFieldId" text NOT NULL,
	"value" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'visitor'::"user_role" NOT NULL;--> statement-breakpoint
CREATE INDEX "category_active_idx" ON "category" ("active");--> statement-breakpoint
CREATE INDEX "category_sort_order_idx" ON "category" ("sortOrder");--> statement-breakpoint
CREATE INDEX "name_idx" ON "business" ("name");--> statement-breakpoint
CREATE INDEX "status_idx" ON "business" ("status");--> statement-breakpoint
CREATE INDEX "featured_idx" ON "business" ("featured");--> statement-breakpoint
CREATE INDEX "location_business_id_idx" ON "location" ("businessId");--> statement-breakpoint
CREATE INDEX "location_city_idx" ON "location" ("city");--> statement-breakpoint
CREATE INDEX "location_district_idx" ON "location" ("district");--> statement-breakpoint
CREATE INDEX "gallery_business_id_idx" ON "gallery" ("businessId");--> statement-breakpoint
CREATE INDEX "social_business_id_idx" ON "social" ("businessId");--> statement-breakpoint
CREATE INDEX "subcategory_category_id_idx" ON "subcategory" ("categoryId");--> statement-breakpoint
CREATE INDEX "contact_business_id_idx" ON "business_contact" ("businessId");--> statement-breakpoint
CREATE INDEX "hours_business_id_idx" ON "business_hours" ("businessId");--> statement-breakpoint
CREATE INDEX "services_business_id_idx" ON "business_services" ("businessId");--> statement-breakpoint
CREATE INDEX "documents_business_id_idx" ON "business_documents" ("businessId");--> statement-breakpoint
CREATE INDEX "amenities_active_idx" ON "amenities" ("active");--> statement-breakpoint
CREATE INDEX "dynamic_fields_category_id_idx" ON "dynamic_fields" ("categoryId");--> statement-breakpoint
CREATE INDEX "business_fields_business_id_idx" ON "business_fields" ("businessId");--> statement-breakpoint
CREATE INDEX "business_fields_dynamic_field_id_idx" ON "business_fields" ("dynamicFieldId");--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_ownerId_user_id_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "social" ADD CONSTRAINT "social_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_categoryId_category_id_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_category" ADD CONSTRAINT "business_category_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_category" ADD CONSTRAINT "business_category_categoryId_category_id_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_contact" ADD CONSTRAINT "business_contact_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_services" ADD CONSTRAINT "business_services_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_documents" ADD CONSTRAINT "business_documents_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_amenities" ADD CONSTRAINT "business_amenities_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_amenities" ADD CONSTRAINT "business_amenities_amenityId_amenities_id_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dynamic_fields" ADD CONSTRAINT "dynamic_fields_categoryId_category_id_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_fields" ADD CONSTRAINT "business_fields_businessId_business_id_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_fields" ADD CONSTRAINT "business_fields_dynamicFieldId_dynamic_fields_id_fkey" FOREIGN KEY ("dynamicFieldId") REFERENCES "dynamic_fields"("id") ON DELETE CASCADE;