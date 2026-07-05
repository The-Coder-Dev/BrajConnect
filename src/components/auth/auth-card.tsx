import { ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full sm:rounded-2xl sm:bg-card sm:p-8 sm:shadow-xl sm:border border-border/40 lg:bg-transparent lg:p-0 lg:shadow-none lg:border-none transition-all">
      {children}
    </div>
  );
}
