"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { NavbarLogo } from "@/components/landing/navbar/navbar-logo";
import { DesktopNav } from "@/components/landing/navbar/desktop-nav";
import { MobileNav } from "@/components/landing/navbar/mobile-nav";
import { AuthButtons } from "@/components/landing/navbar/auth-buttons";
import { ProfileDropdown } from "@/components/landing/navbar/profile-dropdown";

interface NavbarProps {
  variant?: "transparent" | "solid";
}

export function Navbar({ variant = "transparent" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (variant === "solid") return; // No scroll listener needed for solid
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  // For solid variant, we always act like it's scrolled (dark text, background, shadow)
  const isDarkText = variant === "solid" || isScrolled;
  const isSolid = variant === "solid";

  return (
    <header
      className={`z-50 transition-all duration-500 w-full ${
        isSolid
          ? "sticky top-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-border/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3"
          : isScrolled
            ? "fixed top-0 left-0 right-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-border/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3"
            : "fixed top-0 left-0 right-0 bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <div className="flex items-center justify-between">
          <NavbarLogo isScrolled={isScrolled} variant={variant} />

          <DesktopNav isScrolled={isScrolled} variant={variant} />

          <div className="hidden md:flex items-center gap-4">
            <button className={`p-2 transition-colors ${isDarkText ? 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white' : 'text-black hover:text-white'}`}>
              <Search className="h-5 w-5" />
            </button>
            <div className={`h-6 w-px mx-2 transition-colors ${isDarkText ? 'bg-border' : 'bg-white/20'}`}></div>
            
            {!isPending && (
              session?.user ? (
                <ProfileDropdown session={session} />
              ) : (
                <AuthButtons isScrolled={isScrolled} variant={variant} />
              )
            )}
          </div>

          <button
            className={`md:hidden p-2 transition-colors ${isDarkText ? 'text-foreground' : 'text-black'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNav session={session} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}
