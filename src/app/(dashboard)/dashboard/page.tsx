import { requireAuth } from "@/lib/auth/guards";
import { getAdaptiveDashboardData } from "@/server/queries/dashboard/adaptive-dashboard";
import { AdaptiveDashboardView } from "@/features/dashboard/owner/adaptive-dashboard-view";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Owner Dashboard - BrajConnect",
};

interface DashboardPageProps {
  searchParams: Promise<{ businessId?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireAuth();
  const params = await searchParams;

  const res = await getAdaptiveDashboardData(params.businessId);

  if (!res.success || !res.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 border rounded-2xl bg-destructive/5 text-destructive border-destructive/20">
        <AlertTriangle className="h-10 w-10 mb-4" />
        <h2 className="text-xl font-bold">Failed to load dashboard data</h2>
        <p className="text-muted-foreground mt-2">{res.error || "An unexpected error occurred."}</p>
      </div>
    );
  }

  return <AdaptiveDashboardView data={res.data} />;
}
