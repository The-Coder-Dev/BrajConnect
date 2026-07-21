import React from "react";
import { getAdminBusinesses } from "@/server/actions/admin/businesses";
import { AdminBusinessTable } from "@/components/admin/business-table";
import { XCircle } from "lucide-react";

export const metadata = {
  title: "Rejected Businesses - Admin BrajConnect",
};

export default async function RejectedBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const sort = (params.sort as "newest" | "oldest") || "newest";
  const page = parseInt(params.page || "1", 10);

  const res = await getAdminBusinesses({
    status: "rejected",
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
          <XCircle className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-extrabold tracking-tight">Rejected Businesses</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Submissions that failed verification checks or violated listing policies.
        </p>
      </div>

      <AdminBusinessTable data={data} currentStatus="rejected" />
    </div>
  );
}
