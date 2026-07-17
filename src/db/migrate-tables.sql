CREATE TABLE IF NOT EXISTS "category" (
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
)
---BREAK---
CREATE TABLE IF NOT EXISTS "subcategory" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL REFERENCES "category"("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "subcategory_slug_unique" UNIQUE("slug")
)
---BREAK---
CREATE TABLE IF NOT EXISTS "amenities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "amenities_name_unique" UNIQUE("name")
)
---BREAK---
CREATE TABLE IF NOT EXISTS "business" (
	"id" text PRIMARY KEY NOT NULL,
	"ownerId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"shortDescription" text,
	"fullDescription" text,
	"establishedYear" integer,
	"logoUrl" text,
	"logoPublicId" text,
	"coverUrl" text,
	"coverPublicId" text,
	"status" business_status DEFAULT 'draft' NOT NULL,
	"verificationStatus" verification_status DEFAULT 'not_submitted' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"publishedAt" timestamp,
	"deletedAt" timestamp,
	CONSTRAINT "business_slug_unique" UNIQUE("slug")
)
---BREAK---
CREATE TABLE IF NOT EXISTS "location" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL UNIQUE REFERENCES "business"("id") ON DELETE CASCADE,
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
	"updatedAt" timestamp DEFAULT now() NOT NULL
)
---BREAK---
CREATE TABLE IF NOT EXISTS "gallery" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
	"imageUrl" text NOT NULL,
	"cloudinaryPublicId" text,
	"altText" text,
	"width" integer,
	"height" integer,
	"format" text,
	"bytes" integer,
	"isCover" boolean DEFAULT false NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
)
---BREAK---
CREATE TABLE IF NOT EXISTS "social" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
	"platform" social_platform NOT NULL,
	"url" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
)
---BREAK---
CREATE TABLE IF NOT EXISTS "business_category" (
	"businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
	"categoryId" text NOT NULL REFERENCES "category"("id") ON DELETE CASCADE,
	"isPrimary" boolean DEFAULT true NOT NULL,
	PRIMARY KEY("businessId", "categoryId")
)
---BREAK---
CREATE TABLE IF NOT EXISTS "business_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL UNIQUE REFERENCES "business"("id") ON DELETE CASCADE,
	"primaryPhone" text,
	"secondaryPhone" text,
	"whatsapp" text,
	"email" text,
	"website" text,
	"preferredContactMethod" preferred_contact_method,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
)
---BREAK---
CREATE TABLE IF NOT EXISTS "business_hours" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
	"dayOfWeek" integer NOT NULL,
	"isClosed" boolean DEFAULT false NOT NULL,
	"is24Hours" boolean DEFAULT false NOT NULL,
	"openTime" text,
	"closeTime" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
)
---BREAK---
CREATE TABLE IF NOT EXISTS "business_services" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"description" text,
	"price" text,
	"priceUnit" text,
	"duration" text,
	"active" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
)
---BREAK---
CREATE TABLE IF NOT EXISTS "business_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
	"documentType" document_type NOT NULL,
	"fileName" text NOT NULL,
	"storagePath" text NOT NULL,
	"mimeType" text NOT NULL,
	"fileSize" integer,
	"verificationStatus" verification_status DEFAULT 'not_submitted' NOT NULL,
	"notes" text,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"verifiedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
)
---BREAK---
CREATE TABLE IF NOT EXISTS "business_amenities" (
	"businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
	"amenityId" text NOT NULL REFERENCES "amenities"("id") ON DELETE CASCADE,
	"notes" text,
	PRIMARY KEY("businessId", "amenityId")
)
---BREAK---
CREATE TABLE IF NOT EXISTS "dynamic_fields" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL REFERENCES "category"("id") ON DELETE CASCADE,
	"label" text NOT NULL,
	"key" text NOT NULL,
	"inputType" input_type NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"placeholder" text,
	"defaultValue" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"options" jsonb,
	"helpText" text,
	"validationMetadata" jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dynamic_fields_key_category_unique" UNIQUE("key", "categoryId")
)
---BREAK---
CREATE TABLE IF NOT EXISTS "business_fields" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
	"dynamicFieldId" text NOT NULL REFERENCES "dynamic_fields"("id") ON DELETE CASCADE,
	"value" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_fields_business_field_unique" UNIQUE("businessId", "dynamicFieldId")
)
---BREAK---
CREATE INDEX IF NOT EXISTS "category_active_idx" ON "category" ("active")
---BREAK---
CREATE INDEX IF NOT EXISTS "category_sort_order_idx" ON "category" ("sortOrder")
---BREAK---
CREATE INDEX IF NOT EXISTS "dynamic_fields_category_id_idx" ON "dynamic_fields" ("categoryId")
---BREAK---
CREATE INDEX IF NOT EXISTS "name_idx" ON "business" ("name")
---BREAK---
CREATE INDEX IF NOT EXISTS "status_idx" ON "business" ("status")
---BREAK---
CREATE INDEX IF NOT EXISTS "featured_idx" ON "business" ("featured")
---BREAK---
CREATE INDEX IF NOT EXISTS "location_business_id_idx" ON "location" ("businessId")
---BREAK---
CREATE INDEX IF NOT EXISTS "location_city_idx" ON "location" ("city")
