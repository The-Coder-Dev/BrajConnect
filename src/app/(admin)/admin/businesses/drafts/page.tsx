import React from "react";
import { getAdminBusinesses } from "@/server/actions/admin/businesses";
import { AdminBusinessTable } from "@/components/admin/business-table";
import { FileEdit } from "lucide-react";

export const metadata = {
  title: "Draft Businesses - Admin BrajConnect",
};

export default async function DraftBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const sort = (params.sort as "newest" | "oldest") || "newest";
  const page = parseInt(params.page || "1", 10);

  const res = await getAdminBusinesses({
    status: "draft",
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
          <FileEdit className="h-6 w-6 text-slate-600" />
          <h1 className="text-2xl font-extrabold tracking-tight">Draft Businesses</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Unsubmitted business setups currently being edited by owners.
        </p>
      </div>

      <AdminBusinessTable data={data} currentStatus="draft" />
    </div>
  );
}
