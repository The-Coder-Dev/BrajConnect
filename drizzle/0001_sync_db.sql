ALTER TABLE "social" ADD COLUMN "sortOrder" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "business_documents" ADD COLUMN "rejectionReason" text;
--> statement-breakpoint
ALTER TABLE "business_services" RENAME COLUMN "name" TO "title";
--> statement-breakpoint
ALTER TABLE "business_services" DROP COLUMN IF EXISTS "duration";
--> statement-breakpoint
ALTER TABLE "business_services" DROP COLUMN IF EXISTS "price";
--> statement-breakpoint
ALTER TABLE "business_services" DROP COLUMN IF EXISTS "priceUnit";
--> statement-breakpoint
ALTER TABLE "business_documents" DROP COLUMN IF EXISTS "fileSize";
--> statement-breakpoint
ALTER TABLE "business_documents" DROP COLUMN IF EXISTS "notes";
--> statement-breakpoint
ALTER TABLE "business_documents" DROP COLUMN IF EXISTS "verifiedAt";
--> statement-breakpoint
ALTER TABLE "business_amenities" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "business_amenities" DROP COLUMN IF EXISTS "notes";
--> statement-breakpoint
ALTER TABLE "gallery" DROP COLUMN IF EXISTS "deletedAt";
