ALTER TABLE "business_services" ADD COLUMN "deletedAt" timestamp;
--> statement-breakpoint
ALTER TABLE "business_documents" ADD COLUMN "deletedAt" timestamp;
