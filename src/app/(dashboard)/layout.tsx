import { requireAuth } from "@/lib/auth/guards";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getAdaptiveDashboardData } from "@/server/queries/dashboard/adaptive-dashboard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAuth();
  const dashRes = await getAdaptiveDashboardData();
  const activeBusiness = dashRes.success ? dashRes.data?.activeBusiness : null;

  return (
    <SidebarProvider>
      <AppSidebar user={user} activeBusiness={activeBusiness} />
      <SidebarInset>
        <DashboardHeader user={user} />
        <main className="flex flex-1 flex-col px-4 md:px-6 lg:px-8 xl:px-10 py-8 bg-muted/20">
          <div className="w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
