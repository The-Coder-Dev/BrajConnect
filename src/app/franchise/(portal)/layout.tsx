import { requireFranchisePartner } from "@/lib/auth/guards";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { FranchiseSidebar } from "@/components/franchise/franchise-sidebar";
import { FranchiseHeader } from "@/components/franchise/franchise-header";

export default async function FranchisePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireFranchisePartner();

  return (
    <SidebarProvider>
      <FranchiseSidebar user={user} />
      <SidebarInset>
        <FranchiseHeader user={user} />
        <main className="flex flex-1 flex-col px-4 md:px-6 lg:px-8 xl:px-10 py-8 bg-muted/20">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
