"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitFranchiseApplication } from "@/server/actions/franchise/applications";
import {
  Send,
  Loader2,
  CheckCircle2,
  Lock,
  UserPlus,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";

interface ApplyModalProps {
  opportunity: {
    id: string;
    title: string;
    slug: string;
    availableCity: string;
    availableState: string;
    estimatedInvestment: string;
  };
  currentUser: any | null;
  franchiseProfile: any | null;
}

export function ApplyModal({
  opportunity,
  currentUser,
  franchiseProfile,
}: ApplyModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefilled from Franchise Partner profile
  const [preferredLocation, setPreferredLocation] = useState(
    franchiseProfile?.preferredCity
      ? `${franchiseProfile.preferredCity}, ${franchiseProfile.preferredState}`
      : `${opportunity.availableCity}, ${opportunity.availableState}`
  );
  const [investmentCapacity, setInvestmentCapacity] = useState(
    franchiseProfile?.investmentCapacity || opportunity.estimatedInvestment
  );
  const [businessExperience, setBusinessExperience] = useState(
    franchiseProfile?.previousExperience || ""
  );
  const [relevantExperience, setRelevantExperience] = useState("");
  const [whyInterested, setWhyInterested] = useState(
    franchiseProfile?.reasonForApplying || ""
  );
  const [additionalComments, setAdditionalComments] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  const isPartner = currentUser?.role === "franchise_partner";

  const handleApply = async () => {
    if (!preferredLocation.trim()) {
      toast.error("Please enter your preferred location");
      return;
    }

    if (!investmentCapacity.trim()) {
      toast.error("Please enter your investment capacity");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitFranchiseApplication({
        opportunityId: opportunity.id,
        preferredLocation,
        investmentCapacity,
        businessExperience,
        relevantExperience,
        whyInterested,
        additionalComments,
        documentUrl,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to submit franchise application");
      } else {
        toast.success("Application submitted successfully! The business owner will review your details.");
        setIsOpen(false);
        router.push("/franchise/applications");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto h-12 px-8 rounded-2xl font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm gap-2"
      >
        <Briefcase className="h-4 w-4" /> Apply for Franchise
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl max-h-[90vh] overflow-y-auto">
          {/* CASE 1: User is not logged in */}
          {!currentUser ? (
            <div className="py-6 text-center space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 w-fit mx-auto">
                <Lock className="h-8 w-8" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">
                  Franchise Partner Sign In Required
                </DialogTitle>
                <DialogDescription className="text-xs text-center max-w-sm mx-auto">
                  To apply for this opportunity, please sign in with your Franchise Partner account or register as a partner.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2.5 pt-4 max-w-xs mx-auto">
                <Button
                  className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white"
                  render={<Link href={`/login/franchise`} />}
                >
                  Sign In to Apply
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl font-semibold border-border/60"
                  render={<Link href="/register/franchise" />}
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Register as Franchise Partner
                </Button>
              </div>
            </div>
          ) : !isPartner ? (
            /* CASE 2: User is logged in but role is NOT franchise_partner */
            <div className="py-6 text-center space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 w-fit mx-auto">
                <Briefcase className="h-8 w-8" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">
                  Franchise Account Required
                </DialogTitle>
                <DialogDescription className="text-xs text-center max-w-sm mx-auto">
                  You are currently logged in as a {currentUser.role?.replace("_", " ")}. To submit franchise applications, you must register as a Franchise Partner.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2.5 pt-4 max-w-xs mx-auto">
                <Button
                  className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white"
                  render={<Link href="/register/franchise" />}
                >
                  Register as Franchise Partner
                </Button>
              </div>
            </div>
          ) : (
            /* CASE 3: Authenticated Franchise Partner — Show Pre-filled Application Form */
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold">
                      Apply for Franchise
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      {opportunity.title}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Verified Profile Card */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {franchiseProfile?.applicantType === "company"
                      ? franchiseProfile?.companyName
                      : franchiseProfile?.fullName || currentUser.name}
                  </span>
                  <span className="capitalize font-semibold text-muted-foreground">
                    {franchiseProfile?.applicantType || "Partner"} Profile
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3" /> {currentUser.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />{" "}
                    {franchiseProfile?.mobileNumber || franchiseProfile?.companyPhone || "Verified"}
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Preferred Target Location *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        value={preferredLocation}
                        onChange={(e) => setPreferredLocation(e.target.value)}
                        placeholder="e.g. Mathura / Vrindavan"
                        className="pl-9 h-10 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Committed Investment Capacity *
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        value={investmentCapacity}
                        onChange={(e) => setInvestmentCapacity(e.target.value)}
                        placeholder="e.g. ₹10 Lakh - ₹15 Lakh"
                        className="pl-9 h-10 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Why are you interested in this franchise?
                  </Label>
                  <Textarea
                    rows={2}
                    value={whyInterested}
                    onChange={(e) => setWhyInterested(e.target.value)}
                    placeholder="Describe your vision or market opportunity for this brand..."
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Relevant Business Experience
                  </Label>
                  <Input
                    value={businessExperience}
                    onChange={(e) => setBusinessExperience(e.target.value)}
                    placeholder="e.g. 5 years running retail store"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Additional Comments or Questions
                  </Label>
                  <Input
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    placeholder="Any specific questions for the business owner"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Supporting Document URL (Optional)
                  </Label>
                  <Input
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or portfolio link"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-3 border-t border-border/30 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleApply}
                  className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Submit Application
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
