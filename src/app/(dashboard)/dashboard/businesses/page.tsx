import React from "react";
import { requireAuth } from "@/lib/auth/guards";
import { getOwnerBusinesses } from "@/server/actions/business/owner";
import { BusinessesClient } from "@/features/dashboard/owner";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "My Businesses - BrajConnect",
};

export default async function MyBusinessesPage() {
  await requireAuth();
  const res = await getOwnerBusinesses();

  if (!res.success || !res.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 border rounded-2xl bg-destructive/5 text-destructive border-destructive/20">
        <AlertTriangle className="h-10 w-10 mb-4" />
        <h2 className="text-xl font-bold">Failed to load businesses</h2>
        <p className="text-muted-foreground mt-2">{res.error || "An unexpected error occurred."}</p>
      </div>
    );
  }

  return <BusinessesClient initialBusinesses={res.data} />;
}
