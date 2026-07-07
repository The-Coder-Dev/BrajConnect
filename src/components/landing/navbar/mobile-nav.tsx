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
    await authClient.signOut();
    router.refresh();
    onClose();
  };

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
              <Link href="/dashboard" onClick={onClose} className="p-2 text-center font-medium hover:bg-muted rounded-lg text-foreground">
                Dashboard
              </Link>
              <Button variant="outline" className="w-full rounded-lg" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" onClick={onClose} className="p-2 text-center font-medium hover:bg-muted rounded-lg text-foreground">
                Login
              </Link>
              <Button className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/sign-up" onClick={onClose}>Register Business</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
