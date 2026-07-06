"use client";

import React from "react";
import { useAssistant } from "../../context/assistant-context";
import { AssistantHeader } from "@/features/business-setup/components/layout/assistant-header";
import { AssistantFooter } from "@/features/business-setup/components/layout/assistant-footer";

export function AssistantLayout({ children }: { children: React.ReactNode }) {
  const { isLastStep } = useAssistant();

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-[#F8FAFC] overflow-hidden">
      {/* Background Layer 2: Blurred Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top right blue blur */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2563EB]/10 blur-[300px]" />
        {/* Bottom left red blur */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#DC2626]/5 blur-[350px]" />
        {/* Center white glow */}
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-white/40 blur-[200px]" />
      </div>

      {/* Background Layer 3: Noise Texture */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.015]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="relative z-10 flex flex-col w-full h-full min-h-screen items-center justify-between pb-6">
        {!isLastStep && <AssistantHeader />}
        
        <main className="flex-1 w-full max-w-2xl px-6 py-12 md:py-20 flex flex-col">
          <div className="flex-1 w-full relative">
            {children}
          </div>
        </main>
        
        {!isLastStep && <AssistantFooter />}
      </div>
    </div>
  );
}
