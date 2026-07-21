"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Building2,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { approveBusiness, rejectBusiness, requestChanges } from "@/server/actions/admin/businesses";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminBusinessTable({ data, currentStatus }: { data: any; currentStatus?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  // Modal State for Action Reason
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    type: "reject" | "changes" | null;
    businessId: string | null;
    businessName: string | null;
  }>({
    open: false,
    type: null,
    businessId: null,
    businessName: null,
  });
  const [reason, setReason] = useState("");

  const updateFilters = (newSearch?: string, newSort?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch !== undefined) {
      if (newSearch) params.set("search", newSearch);
      else params.delete("search");
    }
    if (newSort !== undefined) {
      params.set("sort", newSort);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, sort);
  };

  const handleApprove = (id: string, name: string) => {
    startTransition(async () => {
      const res = await approveBusiness(id);
      if (res.success) {
        toast.success(`Successfully approved ${name}!`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to approve business.");
      }
    });
  };

  const handleActionSubmit = () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason.");
      return;
    }

    startTransition(async () => {
      if (!actionModal.businessId || !actionModal.type) return;

      let res;
      if (actionModal.type === "reject") {
        res = await rejectBusiness(actionModal.businessId, reason);
      } else {
        res = await requestChanges(actionModal.businessId, reason);
      }

      if (res.success) {
        toast.success(
          actionModal.type === "reject"
            ? `Business "${actionModal.businessName}" rejected.`
            : `Changes requested for "${actionModal.businessName}".`
        );
        setActionModal({ open: false, type: null, businessId: null, businessName: null });
        setReason("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to submit moderation action.");
      }
    });
  };

  const items = data.items || [];
  const pagination = data.pagination || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-4">
      {/* Controls Banner */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl border border-border/50 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 flex items-center gap-2">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-10 rounded-xl bg-muted/30 border-border/40 text-xs"
          />
          <Button type="submit" size="sm" variant="secondary" className="rounded-xl h-10 px-4 text-xs font-semibold">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground shrink-0">
            <Filter className="h-3.5 w-3.5" /> Sort:
          </div>
          <Select
            value={sort}
            onValueChange={(val) => {
              if (val) {
                setSort(val);
                updateFilters(search, val);
              }
            }}
          >
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-muted/30 border-border/40 font-medium">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-bold text-xs">Business</TableHead>
              <TableHead className="font-bold text-xs">Owner</TableHead>
              <TableHead className="font-bold text-xs">Category & Location</TableHead>
              <TableHead className="font-bold text-xs">Documents</TableHead>
              <TableHead className="font-bold text-xs">Submitted / Updated</TableHead>
              <TableHead className="font-bold text-xs">Status</TableHead>
              <TableHead className="text-right font-bold text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              items.map((biz: any) => {
                const categoryName = biz.businessCategories?.[0]?.category?.name || "Uncategorized";
                const docCount = biz.documents?.length || 0;

                return (
                  <TableRow key={biz.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <Link href={`/admin/businesses/${biz.id}`} className="font-bold text-sm hover:underline text-foreground">
                            {biz.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px]">
                            {biz.shortDescription || "No summary added"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <p className="font-semibold text-foreground">{biz.owner?.name || "N/A"}</p>
                        <p className="text-muted-foreground text-[11px] truncate max-w-[150px]">{biz.owner?.email}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <Badge variant="outline" className="text-[10px] py-0 px-2 font-medium bg-muted/40">
                          {categoryName}
                        </Badge>
                        <p className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {biz.location?.city || "Unknown City"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {docCount > 0 ? (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] gap-1 font-semibold">
                          <FileText className="h-3 w-3" /> {docCount} Uploaded
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">No Docs</span>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(biz.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize px-2.5 py-0.5 rounded-full font-bold ${
                          biz.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : biz.status === "pending_review"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : biz.status === "rejected"
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : biz.status === "needs_changes"
                            ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
                            : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                        }`}
                      >
                        {biz.status?.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg"
                          title="View Details"
                          render={<Link href={`/admin/businesses/${biz.id}`} />}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>

                        {biz.status === "pending_review" && (
                          <>
                            <Button
                              size="sm"
                              disabled={isPending}
                              onClick={() => handleApprove(biz.id, biz.name)}
                              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold px-2.5"
                              title="Approve"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isPending}
                              onClick={() =>
                                setActionModal({
                                  open: true,
                                  type: "changes",
                                  businessId: biz.id,
                                  businessName: biz.name,
                                })
                              }
                              className="h-8 border-amber-500/30 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-semibold px-2"
                              title="Request Changes"
                            >
                              <AlertCircle className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isPending}
                              onClick={() =>
                                setActionModal({
                                  open: true,
                                  type: "reject",
                                  businessId: biz.id,
                                  businessName: biz.name,
                                })
                              }
                              className="h-8 border-red-500/30 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold px-2"
                              title="Reject"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm italic">
                  No business listings match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            Showing Page <span className="font-bold text-foreground">{pagination.page}</span> of{" "}
            <span className="font-bold text-foreground">{pagination.totalPages}</span> ({pagination.total} total items)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || isPending}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (pagination.page - 1).toString());
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="rounded-xl h-8 text-xs font-medium"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || isPending}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (pagination.page + 1).toString());
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="rounded-xl h-8 text-xs font-medium"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Dialog for Reject or Request Changes */}
      <Dialog
        open={actionModal.open}
        onOpenChange={(open) => {
          if (!open) setActionModal({ open: false, type: null, businessId: null, businessName: null });
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {actionModal.type === "reject" ? "Reject Submission" : "Request Changes"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Provide feedback or a reason for{" "}
              <span className="font-bold text-foreground">{actionModal.businessName}</span>. This will be sent to the business owner.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Textarea
              placeholder={
                actionModal.type === "reject"
                  ? "e.g., Business details do not match submitted verification documents."
                  : "e.g., Please upload a clearer GST certificate image."
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] rounded-xl text-xs p-3"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setActionModal({ open: false, type: null, businessId: null, businessName: null })}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending || !reason.trim()}
              onClick={handleActionSubmit}
              className={`rounded-xl text-xs font-semibold text-white ${
                actionModal.type === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              Confirm {actionModal.type === "reject" ? "Rejection" : "Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
