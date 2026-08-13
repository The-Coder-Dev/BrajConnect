import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      {/* Global Background Grid Texture */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar variant="solid" />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
