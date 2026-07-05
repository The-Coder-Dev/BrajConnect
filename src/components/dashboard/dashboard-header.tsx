"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardHeader({ user }: { user: any }) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      const isLast = index === paths.length - 1;

      return (
        <div key={path} className="flex items-center">
          <BreadcrumbItem>
            {!isLast ? (
              <BreadcrumbLink href={href} className="text-muted-foreground hover:text-foreground transition-colors">{title}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="font-semibold">{title}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator className="mx-2" />}
        </div>
      );
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      
      <div className="flex flex-1 items-center gap-4 border-l pl-4 ms-2 border-border/50">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList className="flex items-center">
            {generateBreadcrumbs()}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Button 
        className="rounded-lg bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300" 
        render={<Link href="/dashboard/register-business" />}
      >
        <Building2 className="mr-2 h-4 w-4" />
        Register Your Business
      </Button>
    </header>
  );
}
