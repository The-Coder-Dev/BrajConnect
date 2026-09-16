"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { navLinks } from "./desktop-nav";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function MobileNav({ 
  session, 
  onClose 
}: { 
  session: any; 
  onClose: () => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    onClose();
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

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden bg-background border-b border-border overflow-hidden"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClose}
            className="text-base font-medium p-2 hover:bg-muted rounded-lg text-foreground"
          >
            {link.name}
          </Link>
        ))}

        <div className="border-t border-border pt-4 flex flex-col gap-3">
          {session?.user ? (
            <>
              {isFranchisePartner ? (
                <>
                  <Link
                    href="/franchise/dashboard"
                    onClick={onClose}
                    className="p-2 text-center font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-lg"
                  >
                    Franchise Dashboard
                  </Link>
                  <Link
                    href="/setup/business"
                    onClick={onClose}
                    className="p-2 text-center text-sm font-medium hover:bg-muted rounded-lg text-foreground"
                  >
                    Register a Business
                  </Link>
                </>
              ) : isAdmin ? (
                <>
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="p-2 text-center font-medium bg-red-500/10 text-red-700 dark:text-red-300 rounded-lg"
                  >
                    Admin Console
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="p-2 text-center text-sm font-medium hover:bg-muted rounded-lg text-foreground"
                  >
                    Business Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="p-2 text-center font-medium hover:bg-muted rounded-lg text-foreground"
                  >
                    Business Dashboard
                  </Link>
                  <Link
                    href="/setup/business"
                    onClick={onClose}
                    className="p-2 text-center text-sm font-medium hover:bg-muted rounded-lg text-foreground"
                  >
                    Register a Business
                  </Link>
                </>
              )}

              <Button variant="outline" className="w-full rounded-lg" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                onClick={onClose}
                className="p-2 text-center font-medium hover:bg-muted rounded-lg text-foreground"
              >
                Login
              </Link>
              <Button className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" render={<Link href="/sign-up" onClick={onClose} />}>
                Register Business
              </Button>
              <Link
                href="/franchise"
                onClick={onClose}
                className="text-xs text-center text-amber-600 hover:underline font-semibold"
              >
                Franchise Partner Program
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
