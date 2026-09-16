"use client";

import { useEffect, useState } from "react";
import {
  User,
  LogOut,
  LayoutDashboard,
  Building2,
  Compass,
  FileText,
  Store,
  PlusCircle,
  ShieldAlert,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { checkUserBusinessOwnership } from "@/server/queries/business/ownership";

/**
 * Note: checkUserBusinessOwnership is strictly a UI navigation/workspace switcher check.
 * It is NOT an authorization mechanism.
 * Server actions and private business dashboards independently enforce business.ownerId === authUser.id.
 */
export function ProfileDropdown({
  session,
  hasBusiness: serverHasBusiness,
}: {
  session: any;
  hasBusiness?: boolean;
}) {
  const router = useRouter();
  const [businessStatus, setBusinessStatus] = useState<{
    hasBusiness: boolean;
    businessCount: number;
  } | null>(
    typeof serverHasBusiness === "boolean"
      ? { hasBusiness: serverHasBusiness, businessCount: serverHasBusiness ? 1 : 0 }
      : null
  );

  useEffect(() => {
    // Only fetch if not already supplied by the server layout
    if (typeof serverHasBusiness !== "boolean" && session?.user?.id) {
      checkUserBusinessOwnership()
        .then((res) => {
          setBusinessStatus(res);
        })
        .catch((err) => {
          console.error("Failed to load business ownership:", err);
        });
    }
  }, [session?.user?.id, serverHasBusiness]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  };

  const isFranchisePartner = session?.user?.role === "franchise_partner";
  const isAdmin = session?.user?.role === "admin";
  const hasBusiness = businessStatus?.hasBusiness ?? false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-amber-500/50 transition-all outline-none border-none bg-transparent p-0 cursor-pointer">
        <Avatar className="h-10 w-10 transition-transform hover:scale-105">
          <AvatarImage
            src={session.user.image || ""}
            alt={session.user.name || "User"}
          />
          <AvatarFallback className="bg-amber-100 text-amber-700 font-medium">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none truncate">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Franchise Partner Section */}
          {isFranchisePartner && (
            <>
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/franchise/dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4 text-amber-600" />
                <span>Franchise Dashboard</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/franchise/opportunities")}
              >
                <Compass className="mr-2 h-4 w-4 text-amber-600" />
                <span>Explore Opportunities</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/franchise/applications")}
              >
                <FileText className="mr-2 h-4 w-4 text-amber-600" />
                <span>My Applications</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/franchise/units")}
              >
                <Store className="mr-2 h-4 w-4 text-amber-600" />
                <span>My Franchise Units</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/franchise/profile")}
              >
                <User className="mr-2 h-4 w-4 text-amber-600" />
                <span>Franchise Profile</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Dual Capability: Business Ownership options for Franchise Partner */}
              {hasBusiness ? (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/dashboard")}
                  >
                    <Building2 className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Business Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/dashboard/businesses")}
                  >
                    <Store className="mr-2 h-4 w-4 text-blue-600" />
                    <span>My Businesses</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/setup/business")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>Register Another Business</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  className="cursor-pointer flex items-center"
                  onClick={() => router.push("/setup/business")}
                >
                  <PlusCircle className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>Register a Business</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {/* Admin User Section */}
          {isAdmin && (
            <>
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/admin")}
              >
                <ShieldAlert className="mr-2 h-4 w-4 text-red-600" />
                <span>Admin Console</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Business Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/dashboard/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/dashboard/businesses")}
              >
                <Store className="mr-2 h-4 w-4" />
                <span>My Businesses</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                onClick={() => router.push("/setup/business")}
              >
                <PlusCircle className="mr-2 h-4 w-4 text-emerald-600" />
                <span>Register Business</span>
              </DropdownMenuItem>
            </>
          )}

          {/* Standard User / Business Owner Section */}
          {!isFranchisePartner && !isAdmin && (
            <>
              {hasBusiness ? (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/dashboard")}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Business Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/dashboard/businesses")}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    <span>My Businesses</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/setup/business")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>Register Another Business</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onClick={() => router.push("/setup/business")}
                  >
                    <Building2 className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Register a Business</span>
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
