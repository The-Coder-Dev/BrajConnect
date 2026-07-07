"use client";

import Link from "next/link";
import { User, LogOut, LayoutDashboard, Settings, Building2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function ProfileDropdown({ session }: { session: any }) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all outline-none border-none bg-transparent p-0 cursor-pointer">
        <Avatar className="h-10 w-10 transition-transform hover:scale-105">
          <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {/* DropdownMenuGroup is required by Base UI for Menu primitive context */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer flex items-center" 
            onClick={() => router.push("/dashboard/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center"
            onClick={() => router.push("/sign-up")}
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span>Register Business</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center"
            onClick={() => router.push("/dashboard/businesses")}
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span>My Businesses</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/50" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
