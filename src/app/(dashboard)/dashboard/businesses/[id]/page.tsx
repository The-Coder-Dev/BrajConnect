/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getOwnerBusiness } from "@/server/actions/business/owner";
import { notFound } from "next/navigation";
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Heart,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessDetailsActions } from "@/features/dashboard/owner";

export const metadata = {
  title: "Business Details - BrajConnect",
};

export default async function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getOwnerBusiness(id);

  if (!res.success || !res.data) {
    return notFound();
  }

  const biz = res.data;
  const primaryCat = biz.businessCategories?.[0]?.category?.name || "Uncategorized";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs px-3 py-1 rounded-full">Published</Badge>;
      case "pending_review":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs px-3 py-1 rounded-full">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs px-3 py-1 rounded-full">Rejected</Badge>;
      case "draft":
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 text-xs px-3 py-1 rounded-full">Draft</Badge>;
      case "suspended":
        return <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 text-xs px-3 py-1 rounded-full">Suspended</Badge>;
      case "archived":
        return <Badge className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 text-xs px-3 py-1 rounded-full">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getVerificationBadge = (vStatus: string) => {
    switch (vStatus) {
      case "verified":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs px-3 py-1 rounded-full">✓ Verified Listing</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs px-3 py-1 rounded-full">Verification Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs px-3 py-1 rounded-full">Verification Rejected</Badge>;
      case "not_submitted":
      default:
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 text-xs px-3 py-1 rounded-full">Not Submitted for Verification</Badge>;
    }
  };

  const getDayName = (day: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day] || `Day ${day}`;
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Controls Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 p-5 border rounded-2xl border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Business Submission Review</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ensure details are complete. Editing access is locked during pending review phases.
          </p>
        </div>
        <BusinessDetailsActions businessId={biz.id} status={biz.status} slug={biz.slug} />
      </div>

      {/* Admin Rejection / Suspension Notice */}
      {biz.status === "rejected" && (
        <div className="bg-red-50/60 border border-red-200/50 rounded-2xl p-5 flex items-start gap-4">
          <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-red-900">Submission Rejected by Administration</h3>
            <p className="text-sm text-red-700 whitespace-pre-wrap">
              {biz.rejectionReason || "No details provided. Check that location details, documents, or names are accurate."}
            </p>
          </div>
        </div>
      )}

      {biz.status === "suspended" && (
        <div className="bg-violet-50/60 border border-violet-200/50 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-violet-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-violet-900">Listing Suspended</h3>
            <p className="text-sm text-violet-700 whitespace-pre-wrap">
              {biz.suspensionReason || "This business has been suspended due to violations of listing guidelines."}
            </p>
          </div>
        </div>
      )}

      {biz.status === "pending_review" && (
        <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-5 flex items-start gap-4">
          <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-amber-900">Listing Pending Review</h3>
              <Badge className="bg-amber-600/10 text-amber-700 border-amber-600/20 text-xs py-0.5 rounded-full">Pending Verification</Badge>
            </div>
            <div className="text-sm text-amber-800 space-y-1">
              <p>Submitted: <span className="font-semibold">{new Date(biz.updatedAt).toLocaleDateString()}</span></p>
              <p>Estimated review time: <span className="font-semibold">Usually reviewed within 24-48 hours</span></p>
              <p className="font-semibold mt-2 text-amber-900">Editing is disabled while under review.</p>
            </div>
          </div>
        </div>
      )}

      {/* Cover / Profile Banner */}
      <Card className="rounded-2xl border-border/50 bg-card overflow-hidden shadow-xs">
        <div className="h-48 md:h-64 bg-slate-100 relative">
          {biz.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={biz.coverUrl}
              alt={`${biz.name} Cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-linear-to-b from-muted to-muted/20">
              <Building2 className="h-12 w-12" />
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {getStatusBadge(biz.status)}
            {getVerificationBadge(biz.verificationStatus)}
          </div>
        </div>
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            {biz.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={biz.logoUrl}
                alt={biz.name}
                className="h-20 w-20 rounded-2xl border-4 border-background object-cover shadow-sm bg-white shrink-0 -mt-14 z-10"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-slate-100 border-4 border-background shadow-sm shrink-0 -mt-14 z-10 flex items-center justify-center text-slate-400">
                <Building2 className="h-8 w-8" />
              </div>
            )}
            <div className="space-y-1">
              <CardTitle className="text-2xl font-extrabold">{biz.name}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold text-foreground">{primaryCat}</span>
                {biz.establishedYear && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Est. {biz.establishedYear}
                    </span>
                  </>
                )}
                {biz.featured && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <Badge className="bg-amber-500 text-white border-0 shadow-2xs rounded-lg py-0.5 px-2">Featured Listing</Badge>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid Content Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Business */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> About Business
            </h3>
            <div className="space-y-4">
              {biz.shortDescription && (
                <div className="pb-3 border-b border-border/40">
                  <p className="text-sm font-semibold text-muted-foreground">Short Summary</p>
                  <p className="text-base font-medium mt-1 leading-relaxed">{biz.shortDescription}</p>
                </div>
              )}
              {biz.fullDescription ? (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Full Description</p>
                  <p className="text-sm text-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                    {biz.fullDescription}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No detailed description has been added yet.</p>
              )}
            </div>
          </Card>

          {/* Dynamic Fields Details */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> Dynamic Specifics
            </h3>
            {biz.businessFields && biz.businessFields.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {biz.businessFields.map((f: any) => (
                  <div key={f.id} className="p-3 border rounded-xl bg-muted/20 border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {f.dynamicField?.label || f.dynamicFieldId}
                    </p>
                    <p className="text-sm font-bold text-foreground mt-0.5">
                      {f.value === "true" ? "Yes" : f.value === "false" ? "No" : f.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No custom category-specific details added.</p>
            )}
          </Card>

          {/* Amenities & Services */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Amenities */}
            <Card className="rounded-2xl border border-border/50 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" /> Amenities
              </h3>
              {biz.businessAmenities && biz.businessAmenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {biz.businessAmenities.map((am: any) => (
                    <Badge
                      key={am.amenityId}
                      variant="outline"
                      className="rounded-lg py-1 px-3 bg-muted/40 font-medium text-xs text-foreground"
                    >
                      {am.amenity?.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No amenities specified.</p>
              )}
            </Card>

            {/* Services */}
            <Card className="rounded-2xl border border-border/50 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Services Offered
              </h3>
              {biz.services && biz.services.length > 0 ? (
                <div className="space-y-3">
                  {biz.services.map((srv: any) => (
                    <div
                      key={srv.id}
                      className="flex justify-between items-start border-b border-border/30 pb-2 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-bold text-foreground">{srv.name}</p>
                        {srv.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{srv.description}</p>
                        )}
                      </div>
                      {srv.price && (
                        <Badge className="rounded-lg text-xs bg-muted text-foreground border-border/40 font-semibold">
                          ₹{srv.price}
                          {srv.priceUnit ? ` / ${srv.priceUnit}` : ""}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No services listed yet.</p>
              )}
            </Card>
          </div>

          {/* Gallery */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" /> Image Gallery
            </h3>
            {biz.gallery && biz.gallery.length > 0 ? (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                {biz.gallery.map((img: any) => (
                  <div key={img.id} className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imageUrl}
                      alt={img.altText || "Gallery Image"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No additional images have been uploaded.</p>
            )}
          </Card>

          {/* Verification Documents */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Verification Documents
            </h3>
            {biz.documents && biz.documents.length > 0 ? (
              <div className="space-y-3">
                {biz.documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-xl border-border/40 bg-muted/10 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground truncate max-w-[250px]">{doc.fileName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          {doc.documentType} · Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {doc.verificationStatus === "verified" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-lg">Verified</Badge>
                      ) : doc.verificationStatus === "rejected" ? (
                        <div className="text-right">
                          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 rounded-lg">Rejected</Badge>
                          {doc.rejectionReason && (
                            <p className="text-[10px] text-red-600 mt-1 italic">{doc.rejectionReason}</p>
                          )}
                        </div>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-lg">Pending Review</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-xl bg-muted/5">
                No documents uploaded. Listing verification requires document uploads.
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Contact Details */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Phone className="h-4.5 w-4.5 text-primary" /> Contact Details
            </h3>
            {biz.contact ? (
              <div className="space-y-3 text-sm">
                {biz.contact.primaryPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      <p className="font-semibold">{biz.contact.primaryPhone}</p>
                    </div>
                  </div>
                )}
                {biz.contact.whatsapp && (
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp Number</p>
                      <p className="font-semibold text-emerald-600">{biz.contact.whatsapp}</p>
                    </div>
                  </div>
                )}
                {biz.contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-semibold truncate">{biz.contact.email}</p>
                    </div>
                  </div>
                )}
                {biz.contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Website</p>
                      <a
                        href={biz.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        {biz.contact.website}
                      </a>
                    </div>
                  </div>
                )}
                {biz.contact.preferredContactMethod && (
                  <div className="pt-2 border-t text-[11px] text-muted-foreground font-medium">
                    Preferred Contact Method: <span className="uppercase text-foreground">{biz.contact.preferredContactMethod}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No contact information added.</p>
            )}
          </Card>

          {/* Location details */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-primary" /> Business Location
            </h3>
            {biz.location ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Full Address</p>
                  <p className="font-medium mt-0.5 leading-relaxed">{biz.location.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 border rounded-lg bg-muted/20">
                    <span className="text-muted-foreground block">City</span>
                    <span className="font-bold text-foreground mt-0.5 block">{biz.location.city}</span>
                  </div>
                  <div className="p-2 border rounded-lg bg-muted/20">
                    <span className="text-muted-foreground block">State</span>
                    <span className="font-bold text-foreground mt-0.5 block">{biz.location.state}</span>
                  </div>
                  {biz.location.postalCode && (
                    <div className="p-2 border rounded-lg bg-muted/20 col-span-2">
                      <span className="text-muted-foreground block">Postal Code</span>
                      <span className="font-bold text-foreground mt-0.5 block">{biz.location.postalCode}</span>
                    </div>
                  )}
                </div>
                {(biz.location.latitude || biz.location.longitude) && (
                  <div className="pt-2 border-t text-[10px] text-muted-foreground">
                    Coordinates: {biz.location.latitude?.toFixed(5)}, {biz.location.longitude?.toFixed(5)}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No location information added.</p>
            )}
          </Card>

          {/* Business Hours */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-primary" /> Hours of Operation
            </h3>
            {biz.hours && biz.hours.length > 0 ? (
              <div className="space-y-2 text-xs">
                {biz.hours
                  .sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek)
                  .map((hr: any) => (
                    <div key={hr.id} className="flex justify-between items-center py-1 border-b last:border-0 last:pb-0">
                      <span className="font-medium text-muted-foreground">{getDayName(hr.dayOfWeek)}</span>
                      <span className="font-bold text-foreground">
                        {hr.isClosed ? (
                          <span className="text-red-500">Closed</span>
                        ) : hr.is24Hours ? (
                          <span className="text-emerald-500 font-semibold">24 Hours</span>
                        ) : (
                          `${hr.openTime} - ${hr.closeTime}`
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No business hours specified.</p>
            )}
          </Card>

          {/* Social Links */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-primary" /> Social Profiles
            </h3>
            {biz.socials && biz.socials.length > 0 ? (
              <div className="space-y-2 text-xs">
                {biz.socials.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-2 py-1.5 border-b last:border-0">
                    <span className="font-semibold capitalize text-foreground min-w-[70px]">{s.platform}:</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate block flex-1"
                    >
                      {s.url}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No social profiles linked.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
