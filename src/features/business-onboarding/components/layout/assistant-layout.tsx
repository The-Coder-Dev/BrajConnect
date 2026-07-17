"use client";

import React from "react";
import { useAssistant } from "../../context/assistant-context";
import { AssistantHeader } from "@/features/business-onboarding/components/layout/assistant-header";
import { AssistantFooter } from "@/features/business-onboarding/components/layout/assistant-footer";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";

function DraftRecoveryDialog() {
  const { showDraftDialog, draftInfo, resumeDraft, startNewDraft } = useAssistant();

  if (!showDraftDialog) return null;

  const formattedDate = draftInfo?.updatedAt
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(draftInfo.updatedAt)
    : "Recently";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6 z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Resume your draft?</h3>
            <p className="text-sm text-slate-500">Last saved: {formattedDate}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          You have a business setup in progress. Would you like to pick up where you left
          off, or start a completely new draft?
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={resumeDraft}
            className="w-full rounded-xl h-11 bg-linear-to-b from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white shadow-md shadow-blue-500/20"
          >
            Resume Draft
          </Button>
          <Button
            onClick={startNewDraft}
            variant="outline"
            className="w-full rounded-xl h-11 border-slate-200 text-slate-600 hover:text-slate-900 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Start from Beginning
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AssistantLayout({ children }: { children: React.ReactNode }) {
  const { isLastStep } = useAssistant();

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-[#F8FAFC] overflow-hidden">
      {/* Background Layer: Blurred Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2563EB]/10 blur-[300px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#DC2626]/5 blur-[350px]" />
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-white/40 blur-[200px]" />
      </div>

      {/* Noise Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex flex-col w-full h-full min-h-screen items-center justify-between pb-6">
        {!isLastStep && <AssistantHeader />}

        <main className="flex-1 w-full max-w-2xl px-6 py-12 md:py-20 flex flex-col">
          <div className="flex-1 w-full relative">{children}</div>
        </main>

        {!isLastStep && <AssistantFooter />}
      </div>

      {/* Draft Recovery Overlay */}
      <DraftRecoveryDialog />
    </div>
  );
}
