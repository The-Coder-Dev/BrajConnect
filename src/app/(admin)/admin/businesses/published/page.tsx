import React from "react";
import { getAdminBusinesses } from "@/server/actions/admin/businesses";
import { AdminBusinessTable } from "@/components/admin/business-table";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Published Businesses - Admin BrajConnect",
};

export default async function PublishedBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const sort = (params.sort as "newest" | "oldest") || "newest";
  const page = parseInt(params.page || "1", 10);

  const res = await getAdminBusinesses({
    status: "published",
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
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-extrabold tracking-tight">Published Businesses</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Active, verified business listings currently live on BrajConnect.
        </p>
      </div>

      <AdminBusinessTable data={data} currentStatus="published" />
    </div>
  );
}
