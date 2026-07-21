/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getAdminBusinessDetail } from "@/server/actions/admin/businesses";
import { notFound } from "next/navigation";
import Image from "next/image";
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
  History,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminReviewActionPanel } from "@/components/admin/review-action-panel";
import { AdminDocumentViewer } from "@/components/admin/document-viewer";

export const metadata = {
  title: "Review Business Submission - Admin BrajConnect",
};

export default async function AdminBusinessReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getAdminBusinessDetail(id);

  if (!res.success || !res.data) {
    return notFound();
  }

  const biz = res.data;
  const primaryCat = biz.businessCategories?.[0]?.category?.name || "Uncategorized";

  const getDayName = (day: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day] || `Day ${day}`;
  };

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 p-5 border rounded-2xl border-border/50">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Business Submission Moderation</h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Review detailed information, verification documents, and audit history before taking moderation actions.
          </p>
        </div>
      </div>

      {/* Admin Rejection / Suspension Notice */}
      {biz.status === "rejected" && biz.rejectionReason && (
        <div className="bg-red-50/60 border border-red-200/60 rounded-2xl p-5 flex items-start gap-4">
          <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-red-900 text-sm">Listing Currently Rejected</h3>
            <p className="text-xs text-red-700 whitespace-pre-wrap">{biz.rejectionReason}</p>
          </div>
        </div>
      )}

      {biz.status === "needs_changes" && biz.rejectionReason && (
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-amber-900 text-sm">Changes Requested from Owner</h3>
            <p className="text-xs text-amber-800 whitespace-pre-wrap">{biz.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Cover / Profile Banner */}
      <Card className="rounded-2xl border-border/50 bg-card overflow-hidden shadow-xs">
        <div className="h-44 md:h-60 bg-slate-100 relative">
          {biz.coverUrl ? (
            <Image
              src={biz.coverUrl}
              alt={`${biz.name} Cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-linear-to-b from-muted to-muted/20">
              <Building2 className="h-12 w-12" />
            </div>
          )}
        </div>
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            {biz.logoUrl ? (
              <div className="relative h-20 w-20 rounded-2xl border-4 border-background overflow-hidden shadow-sm bg-white shrink-0 -mt-14 z-10">
                <Image src={biz.logoUrl} alt={biz.name} fill className="object-cover" sizes="80px" />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-slate-100 border-4 border-background shadow-sm shrink-0 -mt-14 z-10 flex items-center justify-center text-slate-400">
                <Building2 className="h-8 w-8" />
              </div>
            )}
            <div className="space-y-1">
              <CardTitle className="text-2xl font-extrabold">{biz.name}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="font-semibold text-foreground">{primaryCat}</span>
                {biz.establishedYear && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Est. {biz.establishedYear}
                    </span>
                  </>
                )}
                <span className="text-muted-foreground">·</span>
                <span>
                  Owner: <span className="font-bold text-foreground">{biz.owner?.name}</span> ({biz.owner?.email})
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Review Grid (2 Cols Content, 1 Col Action Panel) */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Columns (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Verification Documents Section */}
          <Card className="rounded-2xl border-2 border-blue-500/20 bg-card p-6 shadow-xs">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> Uploaded Verification Documents
            </h3>
            <AdminDocumentViewer documents={biz.documents || []} />
          </Card>

          {/* About Business */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> About Business
            </h3>
            <div className="space-y-4 text-xs">
              {biz.shortDescription && (
                <div className="pb-3 border-b border-border/40">
                  <p className="font-semibold text-muted-foreground">Short Summary</p>
                  <p className="text-sm font-medium mt-1 leading-relaxed">{biz.shortDescription}</p>
                </div>
              )}
              {biz.fullDescription ? (
                <div>
                  <p className="font-semibold text-muted-foreground">Full Description</p>
                  <p className="text-xs text-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                    {biz.fullDescription}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No detailed description added.</p>
              )}
            </div>
          </Card>

          {/* Dynamic Fields Details */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> Dynamic Fields Specifics
            </h3>
            {biz.businessFields && biz.businessFields.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {biz.businessFields.map((f: any) => (
                  <div key={f.id} className="p-3 border rounded-xl bg-muted/20 border-border/40 text-xs">
                    <p className="font-semibold text-muted-foreground">
                      {f.dynamicField?.label || f.dynamicFieldId}
                    </p>
                    <p className="font-bold text-foreground mt-0.5">
                      {f.value === "true" ? "Yes" : f.value === "false" ? "No" : f.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No category-specific fields added.</p>
            )}
          </Card>

          {/* Amenities & Services Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Amenities */}
            <Card className="rounded-2xl border border-border/50 p-6">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" /> Amenities
              </h3>
              {biz.businessAmenities && biz.businessAmenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {biz.businessAmenities.map((am: any) => (
                    <Badge
                      key={am.amenityId}
                      variant="outline"
                      className="rounded-lg py-1 px-2.5 bg-muted/40 font-medium text-xs text-foreground"
                    >
                      {am.amenity?.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No amenities listed.</p>
              )}
            </Card>

            {/* Services */}
            <Card className="rounded-2xl border border-border/50 p-6">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Services Offered
              </h3>
              {biz.services && biz.services.length > 0 ? (
                <div className="space-y-3 text-xs">
                  {biz.services.map((srv: any) => (
                    <div key={srv.id} className="flex justify-between items-start border-b border-border/30 pb-2 last:border-0">
                      <div>
                        <p className="font-bold text-foreground">{srv.name}</p>
                        {srv.description && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{srv.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No services listed.</p>
              )}
            </Card>
          </div>

          {/* Image Gallery */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" /> Image Gallery
            </h3>
            {biz.gallery && biz.gallery.length > 0 ? (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                {biz.gallery.map((img: any) => (
                  <div key={img.id} className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden border">
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || "Gallery Image"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No gallery images uploaded.</p>
            )}
          </Card>

          {/* Activity Logs & Audit History */}
          <Card className="rounded-2xl border border-border/50 p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Audit & Review History
            </h3>
            {biz.activities && biz.activities.length > 0 ? (
              <div className="space-y-3 text-xs">
                {biz.activities.map((act: any) => (
                  <div key={act.id} className="p-3 border rounded-xl bg-muted/20 border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold capitalize text-primary">{act.action?.replace("_", " ")}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(act.createdAt).toLocaleString()}</span>
                    </div>
                    {act.reason && <p className="text-muted-foreground mt-1 italic">&ldquo;{act.reason}&rdquo;</p>}
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">By: {act.performedByUser?.name || "Admin"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No moderation history recorded for this business.</p>
            )}
          </Card>
        </div>

        {/* Sidebar Column (1 Col Sticky Action Panel & Info) */}
        <div className="space-y-6">
          <AdminReviewActionPanel
            businessId={biz.id}
            businessName={biz.name}
            status={biz.status}
            verificationStatus={biz.verificationStatus}
          />

          {/* Contact Details */}
          <Card className="rounded-2xl border border-border/50 p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> Contact Information
            </h3>
            {biz.contact ? (
              <div className="space-y-2.5 text-xs">
                {biz.contact.primaryPhone && (
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Primary Phone</span>
                    <span className="font-semibold">{biz.contact.primaryPhone}</span>
                  </div>
                )}
                {biz.contact.whatsapp && (
                  <div>
                    <span className="text-muted-foreground block text-[11px]">WhatsApp</span>
                    <span className="font-semibold text-emerald-600">{biz.contact.whatsapp}</span>
                  </div>
                )}
                {biz.contact.email && (
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Contact Email</span>
                    <span className="font-semibold truncate block">{biz.contact.email}</span>
                  </div>
                )}
                {biz.contact.website && (
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Website</span>
                    <a href={biz.contact.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline truncate block">
                      {biz.contact.website}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No contact details provided.</p>
            )}
          </Card>

          {/* Location details */}
          <Card className="rounded-2xl border border-border/50 p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Location Information
            </h3>
            {biz.location ? (
              <div className="space-y-2 text-xs">
                <p className="font-medium leading-relaxed">{biz.location.address}</p>
                <p className="text-muted-foreground">{biz.location.city}, {biz.location.state} {biz.location.postalCode}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No location provided.</p>
            )}
          </Card>

          {/* Operating Hours */}
          <Card className="rounded-2xl border border-border/50 p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Operating Hours
            </h3>
            {biz.hours && biz.hours.length > 0 ? (
              <div className="space-y-1 text-xs">
                {biz.hours
                  .sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek)
                  .map((hr: any) => (
                    <div key={hr.id} className="flex justify-between py-1 border-b last:border-0">
                      <span className="text-muted-foreground font-medium">{getDayName(hr.dayOfWeek)}</span>
                      <span className="font-semibold">
                        {hr.isClosed ? "Closed" : hr.is24Hours ? "24 Hours" : `${hr.openTime} - ${hr.closeTime}`}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No operating hours specified.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
