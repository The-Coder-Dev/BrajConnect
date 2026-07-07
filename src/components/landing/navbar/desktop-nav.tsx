import Link from "next/link";

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "Categories", href: "/#categories" },
  { name: "Businesses", href: "/#businesses" },
  { name: "Pricing", href: "/#pricing" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

export function DesktopNav({ isScrolled, variant = "transparent" }: { isScrolled: boolean, variant?: "transparent" | "solid" }) {
  const isDarkText = variant === "solid" || isScrolled;

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`relative text-sm font-medium transition-colors group ${
            isDarkText 
              ? "text-muted-foreground hover:text-foreground" 
              : "text-black hover:text-primary"
          }`}
        >
          {link.name}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
        </Link>
      ))}
    </nav>
  );
}
