import React from "react";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  // This layout strips away the main app shell/sidebar
  // to provide a distraction-free onboarding workspace.
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
