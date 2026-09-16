CREATE TYPE "public"."franchise_unit_status" AS ENUM('setup_in_progress', 'active', 'temporarily_closed', 'closed');--> statement-breakpoint
CREATE TABLE "franchise_units" (
	"id" text PRIMARY KEY NOT NULL,
	"businessId" text NOT NULL,
	"opportunityId" text NOT NULL,
	"applicationId" text NOT NULL,
	"franchisePartnerId" text NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" text,
	"status" "franchise_unit_status" DEFAULT 'setup_in_progress' NOT NULL,
	"openedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "franchise_units" ADD CONSTRAINT "franchise_units_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_units" ADD CONSTRAINT "franchise_units_opportunityId_franchise_opportunities_id_fk" FOREIGN KEY ("opportunityId") REFERENCES "public"."franchise_opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_units" ADD CONSTRAINT "franchise_units_applicationId_franchise_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."franchise_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_units" ADD CONSTRAINT "franchise_units_franchisePartnerId_user_id_fk" FOREIGN KEY ("franchisePartnerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fu_business_id_idx" ON "franchise_units" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "fu_opportunity_id_idx" ON "franchise_units" USING btree ("opportunityId");--> statement-breakpoint
CREATE INDEX "fu_partner_id_idx" ON "franchise_units" USING btree ("franchisePartnerId");--> statement-breakpoint
CREATE INDEX "fu_application_id_idx" ON "franchise_units" USING btree ("applicationId");--> statement-breakpoint
CREATE INDEX "fu_status_idx" ON "franchise_units" USING btree ("status");