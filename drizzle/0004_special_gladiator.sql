CREATE TYPE "public"."activity_action" AS ENUM('submitted', 'approved', 'rejected', 'changes_requested');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('approved', 'rejected', 'changes_requested');--> statement-breakpoint
ALTER TYPE "public"."business_status" ADD VALUE 'needs_changes' BEFORE 'published';--> statement-breakpoint
CREATE TABLE "business_activity" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"action" "activity_action" NOT NULL,
	"performedBy" text,
	"reason" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_review" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"reviewedBy" text NOT NULL,
	"status" "review_status" NOT NULL,
	"feedback" text,
	"reviewedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_activity" ADD CONSTRAINT "business_activity_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_activity" ADD CONSTRAINT "business_activity_performedBy_user_id_fk" FOREIGN KEY ("performedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_review" ADD CONSTRAINT "business_review_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_review" ADD CONSTRAINT "business_review_reviewedBy_user_id_fk" FOREIGN KEY ("reviewedBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "owner_id_idx" ON "business" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "owner_id_business_id_idx" ON "business" USING btree ("ownerId","id");