import React from "react";
import { getAdminBusinesses } from "@/server/actions/admin/businesses";
import { AdminBusinessTable } from "@/components/admin/business-table";
import { Clock } from "lucide-react";

export const metadata = {
  title: "Pending Verification - Admin BrajConnect",
};

export default async function PendingBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const sort = (params.sort as "newest" | "oldest") || "newest";
  const page = parseInt(params.page || "1", 10);

  const res = await getAdminBusinesses({
    status: "pending_review",
    search,
    sort,
    page,
    limit: 10,
  });

  const data = res.success && res.data ? res.data : { items: [], pagination: { page: 1, totalPages: 1, total: 0 } };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-amber-600" />
          <h1 className="text-2xl font-extrabold tracking-tight">Pending Verification</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Review business listings submitted by owners awaiting admin verification and publication.
        </p>
      </div>

      <AdminBusinessTable data={data} currentStatus="pending_review" />
    </div>
  );
}
