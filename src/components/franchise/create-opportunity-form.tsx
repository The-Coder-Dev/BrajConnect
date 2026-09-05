"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  franchiseOpportunitySchema,
  type FranchiseOpportunityInput,
} from "@/lib/validations/franchise/opportunity";
import { createFranchiseOpportunity } from "@/server/actions/franchise/opportunities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Briefcase,
  IndianRupee,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  Building2,
  Send,
  Save,
} from "lucide-react";

interface CreateOpportunityFormProps {
  business: {
    id: string;
    name: string;
    slug: string;
  };
}

export function CreateOpportunityForm({ business }: CreateOpportunityFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FranchiseOpportunityInput>({
    resolver: zodResolver(franchiseOpportunitySchema),
    defaultValues: {
      businessId: business.id,
      title: "",
      description: "",
      franchiseFee: "₹3 Lakh",
      estimatedInvestment: "₹10 Lakh - ₹15 Lakh",
      investmentRange: "₹10 Lakh - ₹20 Lakh",
      expectedSetupCost: "₹5 Lakh",
      availableState: "Uttar Pradesh",
      availableCity: "Mathura",
      preferredArea: "Prime Commercial / High-footfall area",
      territoryType: "Exclusive Territory",
      minSpaceRequired: "500 - 1000 sq ft",
      experienceRequired: "Retail / Food & Beverage experience preferred",
      eligibilityRequirements: "Active entrepreneur with local market knowledge",
      availableUnits: 1,
      trainingProvided: "Complete operational & staff training provided",
      marketingSupport: "Regional branding, launch collateral, and digital marketing",
      operationalSupport: "Dedicated franchise manager and standard SOPs",
      initialSetupSupport: "Store layout design, equipment procurement guidance",
      agreementDuration: "5 Years",
      renewalTerms: "Renewable upon mutual agreement",
      termsConditions: "Royalty fee and marketing fund per brand agreement",
      requiredDocuments: "Identity proof, address proof, PAN, financial statements",
    },
  });

  const onSubmit = async (data: FranchiseOpportunityInput, submitForReview: boolean) => {
    setIsSubmitting(true);
    try {
      const res = await createFranchiseOpportunity(data, submitForReview);
      if (!res.success) {
        toast.error(res.error || "Failed to create franchise opportunity");
        return;
      }

      toast.success(
        submitForReview
          ? "Franchise opportunity created and submitted for Admin review!"
          : "Franchise opportunity saved as draft!"
      );
      router.push("/dashboard/franchise");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* 1. Basic Information */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" /> Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-semibold">
              Opportunity Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. Exclusive Restaurant Franchise in Mathura"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Associated Business</Label>
            <div className="h-11 px-3.5 flex items-center gap-2 rounded-xl bg-muted/50 border border-border/40 text-sm font-semibold text-foreground">
              <Building2 className="h-4 w-4 text-primary" />
              <span>{business.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">(Auto-associated)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold">
            Opportunity Description *
          </Label>
          <Textarea
            id="description"
            placeholder="Describe what makes your franchise opportunity unique, business potential, revenue models, etc..."
            rows={4}
            disabled={isSubmitting}
            className="rounded-xl"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* 2. Investment Structure */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" /> Investment Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="franchiseFee" className="text-xs font-semibold">
              Franchise Fee *
            </Label>
            <Input
              id="franchiseFee"
              placeholder="e.g. ₹3 Lakh"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("franchiseFee")}
            />
            {errors.franchiseFee && (
              <p className="text-xs text-destructive">{errors.franchiseFee.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedInvestment" className="text-xs font-semibold">
              Estimated Total Investment *
            </Label>
            <Input
              id="estimatedInvestment"
              placeholder="e.g. ₹10–15 Lakh"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("estimatedInvestment")}
            />
            {errors.estimatedInvestment && (
              <p className="text-xs text-destructive">{errors.estimatedInvestment.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentRange" className="text-xs font-semibold">
              Investment Range
            </Label>
            <Input
              id="investmentRange"
              placeholder="e.g. ₹10 Lakh - ₹20 Lakh"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("investmentRange")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedSetupCost" className="text-xs font-semibold">
              Expected Setup Cost
            </Label>
            <Input
              id="expectedSetupCost"
              placeholder="e.g. ₹5 Lakh"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("expectedSetupCost")}
            />
          </div>
        </div>
      </div>

      {/* 3. Location & Territories */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Location & Territory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="availableState" className="text-xs font-semibold">
              Available State *
            </Label>
            <Input
              id="availableState"
              placeholder="e.g. Uttar Pradesh"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("availableState")}
            />
            {errors.availableState && (
              <p className="text-xs text-destructive">{errors.availableState.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableCity" className="text-xs font-semibold">
              Available City / Territory *
            </Label>
            <Input
              id="availableCity"
              placeholder="e.g. Mathura / Vrindavan"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("availableCity")}
            />
            {errors.availableCity && (
              <p className="text-xs text-destructive">{errors.availableCity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredArea" className="text-xs font-semibold">
              Preferred Area
            </Label>
            <Input
              id="preferredArea"
              placeholder="e.g. Commercial High Street"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("preferredArea")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="territoryType" className="text-xs font-semibold">
              Territory Type
            </Label>
            <Input
              id="territoryType"
              placeholder="e.g. Exclusive / Non-Exclusive"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("territoryType")}
            />
          </div>
        </div>
      </div>

      {/* 4. Requirements */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" /> Requirements & Units
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minSpaceRequired" className="text-xs font-semibold">
              Minimum Space Required *
            </Label>
            <Input
              id="minSpaceRequired"
              placeholder="e.g. 500 - 1000 sq ft"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("minSpaceRequired")}
            />
            {errors.minSpaceRequired && (
              <p className="text-xs text-destructive">{errors.minSpaceRequired.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableUnits" className="text-xs font-semibold">
              Number of Franchise Units Available *
            </Label>
            <Input
              id="availableUnits"
              type="number"
              min={1}
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("availableUnits", { valueAsNumber: true })}
            />
            {errors.availableUnits && (
              <p className="text-xs text-destructive">{errors.availableUnits.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceRequired" className="text-xs font-semibold">
              Experience Required
            </Label>
            <Input
              id="experienceRequired"
              placeholder="e.g. Relevant industry experience"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("experienceRequired")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eligibilityRequirements" className="text-xs font-semibold">
              Eligibility Requirements
            </Label>
            <Input
              id="eligibilityRequirements"
              placeholder="e.g. Minimum investment liquid funds"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("eligibilityRequirements")}
            />
          </div>
        </div>
      </div>

      {/* 5. Support & Agreement Terms */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Support & Agreement Terms
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trainingProvided" className="text-xs font-semibold">
              Training Provided
            </Label>
            <Input
              id="trainingProvided"
              placeholder="e.g. 2 weeks on-site & staff training"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("trainingProvided")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketingSupport" className="text-xs font-semibold">
              Marketing Support
            </Label>
            <Input
              id="marketingSupport"
              placeholder="e.g. Digital ads, brand assets, launch event"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("marketingSupport")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agreementDuration" className="text-xs font-semibold">
              Agreement Duration
            </Label>
            <Input
              id="agreementDuration"
              placeholder="e.g. 5 Years"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("agreementDuration")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewalTerms" className="text-xs font-semibold">
              Renewal Terms
            </Label>
            <Input
              id="renewalTerms"
              placeholder="e.g. Subject to performance review"
              disabled={isSubmitting}
              className="h-11 rounded-xl"
              {...register("renewalTerms")}
            />
          </div>
        </div>
      </div>

      {/* Submission Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleSubmit((d) => onSubmit(d as any, false))}
          className="w-full sm:w-auto h-11 rounded-xl font-semibold gap-1.5"
        >
          <Save className="h-4 w-4" /> Save as Draft
        </Button>

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit((d) => onSubmit(d as any, true))}
          className="w-full sm:w-auto h-11 rounded-xl font-bold bg-primary hover:bg-red-600 text-white gap-2 shadow-md"
        >
          <Send className="h-4 w-4" /> Submit for Admin Review
        </Button>
      </div>
    </form>
  );
}
