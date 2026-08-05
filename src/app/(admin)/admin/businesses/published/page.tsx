import React from "react";
import { getAdminBusinesses } from "@/server/actions/admin/businesses";
import { AdminBusinessTable } from "@/components/admin/business-table";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Published Businesses - Admin BachatLal",
};

export default async function PublishedBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.query || "";

  const data = await getAdminBusinesses({
    status: "published",
    page,
    limit: 10,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          Published Businesses
        </h1>
        <p className="text-sm text-muted-foreground">
          Active, verified business listings currently live on BachatLal.
        </p>
      </div>

      <AdminBusinessTable data={data} currentStatus="published" />
    </div>
  );
}
