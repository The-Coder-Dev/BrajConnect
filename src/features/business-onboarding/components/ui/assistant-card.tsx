"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AssistantCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AssistantCard({ children, className, ...props }: AssistantCardProps) {
  return (
    <div 
      className={cn(
        "bg-white/80 backdrop-blur-xl border border-white/60 rounded-[24px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 hover:shadow-[0_8px_40px_rgb(37,99,235,0.06)] transition-all duration-500 ease-out",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AssistantQuestion({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={cn("text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-8", className)}>
      {children}
    </h3>
  );
}
