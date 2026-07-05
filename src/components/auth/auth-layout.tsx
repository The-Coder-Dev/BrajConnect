import { ReactNode } from "react";
import { HeroPanel } from "./hero-panel";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* Left Form Section */}
      <div className="flex w-full flex-1 lg:flex-none lg:w-[45%] flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-[430px]">
          {children}
        </div>
      </div>
      
      {/* Right Hero Section */}
      <HeroPanel />
    </div>
  );
}
