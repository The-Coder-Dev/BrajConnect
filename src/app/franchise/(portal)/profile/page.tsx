import React from "react";
import { getFranchiseDashboardData } from "@/server/actions/franchise/profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Briefcase,
  FileText,
  Globe,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Franchise Profile - BachatLal",
};

export default async function FranchiseProfilePage() {
  const res = await getFranchiseDashboardData();
  const profile = res.success ? res.data?.profile : null;
  const user = res.success ? res.data?.user : null;

  const isCompany = profile?.applicantType === "company";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Franchise Partner Profile</h1>
        <p className="text-muted-foreground text-sm">
          Your registered applicant credentials and regional expansion preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Core Identity Card */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  {isCompany ? (
                    <Building2 className="h-5 w-5 text-amber-600" />
                  ) : (
                    <User className="h-5 w-5 text-amber-600" />
                  )}
                  {isCompany ? profile?.companyName : profile?.fullName || user?.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  Applicant Type:{" "}
                  <span className="capitalize font-semibold text-foreground">
                    {profile?.applicantType}
                  </span>
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-xs px-3 py-1 font-semibold"
              >
                Verified Partner Account
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/30 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Mail className="h-3.5 w-3.5 text-amber-600" /> Email Address
                </span>
                <p className="font-bold text-foreground">
                  {isCompany ? profile?.companyEmail : user?.email}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/30 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5 text-amber-600" /> Contact Number
                </span>
                <p className="font-bold text-foreground">
                  {isCompany ? profile?.companyPhone : profile?.mobileNumber || "Not specified"}
                </p>
              </div>
            </div>

            {/* Franchise Territory & Investment Preferences */}
            <div className="pt-2 border-t border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Expansion Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/30 space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-amber-600" /> Preferred Location
                  </span>
                  <p className="font-bold text-foreground">
                    {profile?.preferredCity}, {profile?.preferredState}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/30 space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <IndianRupee className="h-3.5 w-3.5 text-amber-600" /> Investment Capacity
                  </span>
                  <p className="font-bold text-foreground">{profile?.investmentCapacity}</p>
                </div>
              </div>
            </div>

            {/* Company Specific Information */}
            {isCompany && (
              <div className="pt-2 border-t border-border/40 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Authorized Person & Corporate Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/30 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-amber-600" /> Authorized Representative
                    </span>
                    <p className="font-bold text-foreground">
                      {profile?.authorizedPersonName} ({profile?.authorizedPersonDesignation})
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {profile?.authorizedPersonEmail} • {profile?.authorizedPersonPhone}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/30 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <FileText className="h-3.5 w-3.5 text-amber-600" /> Tax & Reg Identifiers
                    </span>
                    <p className="font-medium text-foreground">
                      GST: <span className="font-bold">{profile?.gstNumber || "N/A"}</span>
                    </p>
                    <p className="font-medium text-foreground">
                      PAN: <span className="font-bold">{profile?.panNumber || "N/A"}</span>
                    </p>
                  </div>
                </div>

                {profile?.companyWebsite && (
                  <div className="text-xs flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={profile.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:underline"
                    >
                      {profile.companyWebsite}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Individual Specific Background */}
            {!isCompany && (profile?.previousExperience || profile?.reasonForApplying) && (
              <div className="pt-2 border-t border-border/40 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Experience & Background
                </h4>
                {profile?.previousExperience && (
                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-muted-foreground">Past Experience:</span>
                    <p className="text-foreground">{profile.previousExperience}</p>
                  </div>
                )}
                {profile?.reasonForApplying && (
                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-muted-foreground">Motivation / Vision:</span>
                    <p className="text-foreground">{profile.reasonForApplying}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
