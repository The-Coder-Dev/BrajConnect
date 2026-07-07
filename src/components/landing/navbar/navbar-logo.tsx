import Link from "next/link";
import { Building2 } from "lucide-react";

export function NavbarLogo({ isScrolled, variant = "transparent" }: { isScrolled: boolean, variant?: "transparent" | "solid" }) {
  const isDarkText = variant === "solid" || isScrolled;
  
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="bg-primary p-2 rounded-xl text-white">
        <Building2 className="h-5 w-5" />
      </div>
      <span className={`text-xl font-bold tracking-tight transition-colors ${isDarkText ? "text-foreground" : "text-black"}`}>
        BrajConnect
      </span>
    </Link>
  );
}
