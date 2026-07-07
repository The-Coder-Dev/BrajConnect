import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthButtons({ isScrolled, variant = "transparent" }: { isScrolled: boolean, variant?: "transparent" | "solid" }) {
  const isDarkText = variant === "solid" || isScrolled;

  return (
    <>
      <Link 
        href="/sign-in" 
        className={`text-sm font-medium transition-colors ${
          isDarkText ? "text-foreground hover:text-blue-600" : "text-black hover:text-blue-600"
        }`}
      >
        Login
      </Link>
      <Button className="h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-300 px-8 text-sm font-medium">
        <Link href="/sign-up">Register Business</Link>
      </Button>
    </>
  );
}
