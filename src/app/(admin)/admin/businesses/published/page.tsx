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
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const search = params?.search || "";

  const { data } = await getAdminBusinesses({
    status: "published",
    page,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-extrabold tracking-tight">Published Businesses</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Active, verified business listings currently live on BachatLal.
        </p>
      </div>

      <AdminBusinessTable data={data} currentStatus="published" />
    </div>
  );
}
