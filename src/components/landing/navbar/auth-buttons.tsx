import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthButtons({ isScrolled, variant = "transparent" }: { isScrolled: boolean, variant?: "transparent" | "solid" }) {
  const isDarkText = variant === "solid" || isScrolled;

  return (
    <>
      <Link 
        href="/sign-in" 
        className={`text-sm font-medium transition-colors ${
          isDarkText ? "text-foreground hover:text-red-600" : "text-black hover:text-primary"
        }`}
      >
        Login
      </Link>
      <Button render={<Link href="/sign-up" />} className="h-11 rounded-full bg-primary hover:bg-red-600 text-white shadow-[0_8px_20px_-6px_rgba(222,59,61,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(222,59,61,0.6)] hover:-translate-y-0.5 transition-all duration-300 px-8 text-sm font-medium">
        Register Business
      </Button>
    </>
  );
}


// rgb(222, 59, 61)