import { BusinessSetupAssistant } from "@/features/business-onboarding/components/assistant";
import { requireAuth } from "@/lib/auth/guards";
import { Suspense } from "react";

export const metadata = {
  title: "Setup Business - BrajConnect",
};

export default async function BusinessSetupPage() {
  // Protect this route, requires authentication
  await requireAuth();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8FAFC]">
        <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    }>
      <BusinessSetupAssistant />
    </Suspense>
  );
}
