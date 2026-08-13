import Link from "next/link";
import Image from "next/image";

export function NavbarLogo({ isScrolled, variant = "transparent" }: { isScrolled: boolean, variant?: "transparent" | "solid" }) {
  const isDarkText = variant === "solid" || isScrolled;
  
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.webp" height={55} width={55} alt="Logo" priority />
      <span className={`text-xl font-bold tracking-tight transition-colors ${isDarkText ? "text-foreground" : "text-black"}`}>
        BachatLal
      </span>
    </Link>
  );
}
