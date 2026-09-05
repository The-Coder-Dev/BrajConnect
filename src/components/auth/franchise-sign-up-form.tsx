"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { AuthButton } from "./auth-button";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Globe,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  individualFranchiseRegisterSchema,
  companyFranchiseRegisterSchema,
  type IndividualFranchiseInput,
  type CompanyFranchiseInput,
} from "@/lib/validations/auth/franchise-register";
import { completeFranchiseRegistration } from "@/server/actions/franchise/auth";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const investmentOptions = [
  "Under ₹5 Lakh",
  "₹5 Lakh – ₹10 Lakh",
  "₹10 Lakh – ₹25 Lakh",
  "₹25 Lakh – ₹50 Lakh",
  "₹50 Lakh – ₹1 Crore",
  "Above ₹1 Crore",
];

export function FranchiseSignUpForm() {
  const router = useRouter();
  const [applicantType, setApplicantType] = useState<"individual" | "company">("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Individual Form
  const individualForm = useForm<IndividualFranchiseInput>({
    resolver: zodResolver(individualFranchiseRegisterSchema),
    defaultValues: {
      applicantType: "individual",
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      preferredState: "",
      preferredCity: "",
      investmentCapacity: investmentOptions[1],
      previousExperience: "",
      currentOccupation: "",
      reasonForApplying: "",
    },
  });

  // Company Form
  const companyForm = useForm<CompanyFranchiseInput>({
    resolver: zodResolver(companyFranchiseRegisterSchema),
    defaultValues: {
      applicantType: "company",
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companyWebsite: "",
      gstNumber: "",
      panNumber: "",
      companyDescription: "",
      authorizedPersonName: "",
      authorizedPersonDesignation: "",
      authorizedPersonEmail: "",
      authorizedPersonPhone: "",
      password: "",
      confirmPassword: "",
      preferredState: "",
      preferredCity: "",
      investmentCapacity: investmentOptions[2],
    },
  });

  const onIndividualSubmit = async (values: IndividualFranchiseInput) => {
    setIsSubmitting(true);
    try {
      // 1. Sign up user account with Better Auth
      const { error: authError } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.fullName,
      });

      if (authError) {
        toast.error(authError.message || "Failed to create account. Please check your details.");
        setIsSubmitting(false);
        return;
      }

      // 2. Complete Franchise Partner Registration (sets role & creates profile)
      const res = await completeFranchiseRegistration(values);
      if (!res.success) {
        toast.error(res.error || "Failed to complete franchise profile.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Welcome! Your Franchise Partner account is ready.");
      router.push("/franchise/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Individual registration error:", err);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const onCompanySubmit = async (values: CompanyFranchiseInput) => {
    setIsSubmitting(true);
    try {
      // 1. Sign up user account with Better Auth using authorized person's email & credentials
      const { error: authError } = await authClient.signUp.email({
        email: values.authorizedPersonEmail,
        password: values.password,
        name: values.companyName,
      });

      if (authError) {
        toast.error(authError.message || "Failed to create company account. Please check your details.");
        setIsSubmitting(false);
        return;
      }

      // 2. Complete Franchise Partner Registration
      const res = await completeFranchiseRegistration(values);
      if (!res.success) {
        toast.error(res.error || "Failed to complete company franchise profile.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Welcome! Your Company Franchise account is ready.");
      router.push("/franchise/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Company registration error:", err);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Select Applicant Type via Two Large Selectable Radio Cards */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">
          How are you applying?
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Individual */}
          <button
            type="button"
            onClick={() => setApplicantType("individual")}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
              applicantType === "individual"
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs"
                : "border-border/60 hover:border-border hover:bg-muted/30"
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary mb-3">
                <User className="h-5 w-5" />
              </div>
              {applicantType === "individual" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Individual</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Apply as an individual franchise partner or sole entrepreneur.
              </p>
            </div>
          </button>

          {/* Card 2: Company / Organization */}
          <button
            type="button"
            onClick={() => setApplicantType("company")}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
              applicantType === "company"
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs"
                : "border-border/60 hover:border-border hover:bg-muted/30"
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 mb-3">
                <Building2 className="h-5 w-5" />
              </div>
              {applicantType === "company" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                Company / Organization
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Apply on behalf of a registered company, firm, or entity.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* INDIVIDUAL FORM */}
      {applicantType === "individual" && (
        <form
          className="space-y-6"
          onSubmit={individualForm.handleSubmit(onIndividualSubmit)}
        >
          {/* Section 1: Personal Information */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> Personal Information
            </h4>

            <AuthInput
              label="Full Name *"
              id="ind-fullName"
              placeholder="e.g. Rahul Sharma"
              icon={User}
              disabled={isSubmitting}
              error={individualForm.formState.errors.fullName?.message}
              {...individualForm.register("fullName")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="Email Address *"
                id="ind-email"
                type="email"
                placeholder="rahul@example.com"
                icon={Mail}
                disabled={isSubmitting}
                error={individualForm.formState.errors.email?.message}
                {...individualForm.register("email")}
              />

              <AuthInput
                label="Mobile Number *"
                id="ind-mobile"
                type="tel"
                placeholder="9876543210"
                icon={Phone}
                disabled={isSubmitting}
                error={individualForm.formState.errors.mobileNumber?.message}
                {...individualForm.register("mobileNumber")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Password *"
                id="ind-password"
                placeholder="Min 8 characters"
                disabled={isSubmitting}
                error={individualForm.formState.errors.password?.message}
                {...individualForm.register("password")}
              />

              <PasswordInput
                label="Confirm Password *"
                id="ind-confirmPassword"
                placeholder="Repeat password"
                disabled={isSubmitting}
                error={individualForm.formState.errors.confirmPassword?.message}
                {...individualForm.register("confirmPassword")}
              />
            </div>
          </div>

          {/* Section 2: Franchise Information */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-primary" /> Franchise Preferences
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="Preferred State *"
                id="ind-preferredState"
                placeholder="e.g. Uttar Pradesh"
                icon={MapPin}
                disabled={isSubmitting}
                error={individualForm.formState.errors.preferredState?.message}
                {...individualForm.register("preferredState")}
              />

              <AuthInput
                label="Preferred City / Location *"
                id="ind-preferredCity"
                placeholder="e.g. Mathura / Vrindavan"
                icon={MapPin}
                disabled={isSubmitting}
                error={individualForm.formState.errors.preferredCity?.message}
                {...individualForm.register("preferredCity")}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Investment Capacity *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <select
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  disabled={isSubmitting}
                  {...individualForm.register("investmentCapacity")}
                >
                  {investmentOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Optional Experience Details */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Background & Experience (Optional)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="Current Occupation"
                id="ind-occupation"
                placeholder="e.g. Business Owner / Professional"
                icon={Briefcase}
                disabled={isSubmitting}
                {...individualForm.register("currentOccupation")}
              />

              <AuthInput
                label="Previous Business Experience"
                id="ind-experience"
                placeholder="e.g. 5 years in Retail"
                icon={FileText}
                disabled={isSubmitting}
                {...individualForm.register("previousExperience")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ind-reason" className="text-sm font-medium">
                Why do you want to become a franchise partner?
              </Label>
              <Textarea
                id="ind-reason"
                placeholder="Share your goals, motivation, or vision..."
                rows={3}
                disabled={isSubmitting}
                className="rounded-xl border-input bg-background text-sm"
                {...individualForm.register("reasonForApplying")}
              />
            </div>
          </div>

          <AuthButton type="submit" className="w-full mt-4" isLoading={isSubmitting}>
            Create Franchise Partner Account
          </AuthButton>
        </form>
      )}

      {/* COMPANY / ORGANIZATION FORM */}
      {applicantType === "company" && (
        <form
          className="space-y-6"
          onSubmit={companyForm.handleSubmit(onCompanySubmit)}
        >
          {/* Section 1: Company Information */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" /> Company Details
            </h4>

            <AuthInput
              label="Company / Organization Name *"
              id="comp-name"
              placeholder="e.g. Acme Enterprises Pvt Ltd"
              icon={Building2}
              disabled={isSubmitting}
              error={companyForm.formState.errors.companyName?.message}
              {...companyForm.register("companyName")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="Company Email *"
                id="comp-email"
                type="email"
                placeholder="info@acme.com"
                icon={Mail}
                disabled={isSubmitting}
                error={companyForm.formState.errors.companyEmail?.message}
                {...companyForm.register("companyEmail")}
              />

              <AuthInput
                label="Company Phone *"
                id="comp-phone"
                type="tel"
                placeholder="9876543210"
                icon={Phone}
                disabled={isSubmitting}
                error={companyForm.formState.errors.companyPhone?.message}
                {...companyForm.register("companyPhone")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="Preferred State *"
                id="comp-state"
                placeholder="e.g. Uttar Pradesh"
                icon={MapPin}
                disabled={isSubmitting}
                error={companyForm.formState.errors.preferredState?.message}
                {...companyForm.register("preferredState")}
              />

              <AuthInput
                label="Preferred City / Location *"
                id="comp-city"
                placeholder="e.g. Mathura / Agra"
                icon={MapPin}
                disabled={isSubmitting}
                error={companyForm.formState.errors.preferredCity?.message}
                {...companyForm.register("preferredCity")}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Investment Capacity *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <select
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  disabled={isSubmitting}
                  {...companyForm.register("investmentCapacity")}
                >
                  {investmentOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Company Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <AuthInput
                label="Company Website (Optional)"
                id="comp-website"
                placeholder="https://company.com"
                icon={Globe}
                disabled={isSubmitting}
                {...companyForm.register("companyWebsite")}
              />

              <AuthInput
                label="GST Number (Optional)"
                id="comp-gst"
                placeholder="09AAAAA0000A1Z5"
                icon={FileText}
                disabled={isSubmitting}
                {...companyForm.register("gstNumber")}
              />

              <AuthInput
                label="PAN / Reg No (Optional)"
                id="comp-pan"
                placeholder="AAAAA0000A"
                icon={FileText}
                disabled={isSubmitting}
                {...companyForm.register("panNumber")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comp-desc" className="text-sm font-medium">
                Company Description (Optional)
              </Label>
              <Textarea
                id="comp-desc"
                placeholder="Briefly describe your company's business activities..."
                rows={2}
                disabled={isSubmitting}
                className="rounded-xl border-input bg-background text-sm"
                {...companyForm.register("companyDescription")}
              />
            </div>
          </div>

          {/* Section 2: Authorized Person */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> Authorized Person (Account Sign In)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="Full Name *"
                id="auth-name"
                placeholder="e.g. Vikram Verma"
                icon={User}
                disabled={isSubmitting}
                error={companyForm.formState.errors.authorizedPersonName?.message}
                {...companyForm.register("authorizedPersonName")}
              />

              <AuthInput
                label="Designation *"
                id="auth-desig"
                placeholder="e.g. Managing Director / Partner"
                icon={Briefcase}
                disabled={isSubmitting}
                error={companyForm.formState.errors.authorizedPersonDesignation?.message}
                {...companyForm.register("authorizedPersonDesignation")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="Authorized Person Email *"
                id="auth-email"
                type="email"
                placeholder="vikram@acme.com"
                icon={Mail}
                disabled={isSubmitting}
                error={companyForm.formState.errors.authorizedPersonEmail?.message}
                {...companyForm.register("authorizedPersonEmail")}
              />

              <AuthInput
                label="Authorized Person Mobile *"
                id="auth-mobile"
                type="tel"
                placeholder="9876543210"
                icon={Phone}
                disabled={isSubmitting}
                error={companyForm.formState.errors.authorizedPersonPhone?.message}
                {...companyForm.register("authorizedPersonPhone")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Account Password *"
                id="comp-password"
                placeholder="Min 8 characters"
                disabled={isSubmitting}
                error={companyForm.formState.errors.password?.message}
                {...companyForm.register("password")}
              />

              <PasswordInput
                label="Confirm Password *"
                id="comp-confirmPassword"
                placeholder="Repeat password"
                disabled={isSubmitting}
                error={companyForm.formState.errors.confirmPassword?.message}
                {...companyForm.register("confirmPassword")}
              />
            </div>
          </div>

          <AuthButton type="submit" className="w-full mt-4" isLoading={isSubmitting}>
            Create Company Franchise Account
          </AuthButton>
        </form>
      )}
    </div>
  );
}
