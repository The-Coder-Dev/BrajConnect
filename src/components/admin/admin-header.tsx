"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminHeader({ user }: { user: any }) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const title =
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      const isLast = index === paths.length - 1;

      return (
        <div key={path} className="flex items-center">
          <BreadcrumbItem>
            {!isLast ? (
              <BreadcrumbLink
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
              >
                {title}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="font-bold text-xs text-foreground">
                {title}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator className="mx-2" />}
        </div>
      );
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <div className="flex items-center gap-3 border-l pl-4 ms-1 border-border/50">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList className="flex items-center">
              {generateBreadcrumbs()}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="bg-red-500/10 text-red-600 border-red-500/20 text-xs py-1 px-3 rounded-full font-semibold"
        >
          🛡️ Admin Moderation Mode
        </Badge>
      </div>
    </header>
  );
}
