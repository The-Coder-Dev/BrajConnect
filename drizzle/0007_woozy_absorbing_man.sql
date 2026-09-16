ALTER TABLE "franchise_units" DROP CONSTRAINT "franchise_units_businessId_business_id_fk";
--> statement-breakpoint
ALTER TABLE "franchise_units" DROP CONSTRAINT "franchise_units_opportunityId_franchise_opportunities_id_fk";
--> statement-breakpoint
ALTER TABLE "franchise_units" DROP CONSTRAINT "franchise_units_applicationId_franchise_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "franchise_units" DROP CONSTRAINT "franchise_units_franchisePartnerId_user_id_fk";
--> statement-breakpoint
DROP INDEX "fu_application_id_idx";--> statement-breakpoint
ALTER TABLE "franchise_units" ADD CONSTRAINT "franchise_units_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_units" ADD CONSTRAINT "franchise_units_opportunityId_franchise_opportunities_id_fk" FOREIGN KEY ("opportunityId") REFERENCES "public"."franchise_opportunities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_units" ADD CONSTRAINT "franchise_units_applicationId_franchise_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."franchise_applications"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_units" ADD CONSTRAINT "franchise_units_franchisePartnerId_user_id_fk" FOREIGN KEY ("franchisePartnerId") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "fu_application_id_unique" ON "franchise_units" USING btree ("applicationId");