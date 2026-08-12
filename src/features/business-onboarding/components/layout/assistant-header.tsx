"use client";

import React from "react";
import { useAssistant } from "../../context/assistant-context";
import { AssistantProgress } from "../ui/assistant-progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

// Explicitly tracked steps (Welcome and Success are untracked)
const TRACKED_STEP_IDS = [
  "name",
  "category",
  "dynamic_fields",
  "contact",
  "location",
  "hours",
  "brand",
  "about",
  "documents",
  "review",
] as const;

// Estimated minutes per tracked step
const STEP_TIME_MAP: Record<string, number> = {
  name: 1,
  category: 1,
  dynamic_fields: 2,
  contact: 1,
  location: 1,
  hours: 1,
  brand: 2,
  about: 1,
  documents: 2,
  review: 1,
};

export function AssistantHeader() {
  const {
    currentStepIndex,
    steps,
    currentStep,
    requestLeave,
    showLeaveDialog,
    confirmLeave,
    cancelLeave,
    businessId,
  } = useAssistant();

  const trackedStepIndex = TRACKED_STEP_IDS.indexOf(currentStep?.id as any);
  const showProgress = trackedStepIndex !== -1;
  const currentTrackedStepNumber = trackedStepIndex + 1; // 1 to 10
  const totalTrackedSteps = TRACKED_STEP_IDS.length; // 10

  const progressPercentage = showProgress
    ? Math.round((currentTrackedStepNumber / totalTrackedSteps) * 100)
    : 0;

  // Estimated time remaining
  const remainingTrackedSteps = TRACKED_STEP_IDS.slice(trackedStepIndex + 1);
  const remainingMins = remainingTrackedSteps.reduce(
    (acc, sId) => acc + (STEP_TIME_MAP[sId] || 1),
    0
  );
  const timeLabel = remainingMins <= 1 ? "~1 min" : `~${remainingMins} min`;

  return (
    <>
      <header className="w-full h-20 flex items-center justify-center border-b border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] sticky top-0 z-40">
        <div className="w-full max-w-5xl px-6 flex items-center justify-between gap-4">
          {/* Left: Back to Dashboard */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 shrink-0 gap-1.5"
            onClick={requestLeave}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          {/* Center: Step title + step count */}
          <div className="flex-1 text-center">
            <h2 className="font-semibold text-base sm:text-lg tracking-tight text-slate-900 truncate">
              {showProgress ? currentStep.title : "Business Setup"}
            </h2>
            {showProgress && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Step {currentTrackedStepNumber} of {totalTrackedSteps}
              </p>
            )}
          </div>

          {/* Right: Progress bar + % + time */}
          {showProgress ? (
            <div className="flex flex-col items-end gap-1.5 w-40 shrink-0">
              <AssistantProgress value={progressPercentage} />
              <div className="flex items-center justify-between w-full text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span>{progressPercentage}%</span>
                <span>{timeLabel} left</span>
              </div>
            </div>
          ) : (
            <div className="w-40" /> // Spacer for layout balance
          )}
        </div>
      </header>

      {/* Leave Confirmation Dialog */}
      {showLeaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={cancelLeave}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6">
            <button
              onClick={cancelLeave}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Leave Setup?
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              {businessId
                ? "Your progress is automatically saved. You can return anytime to continue where you left off."
                : "Are you sure you want to leave? You haven't saved any progress yet."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={cancelLeave}
                variant="outline"
                className="flex-1 rounded-xl h-10 border-slate-200"
              >
                Continue Editing
              </Button>
              <Button
                onClick={confirmLeave}
                className="flex-1 rounded-xl h-10 bg-slate-900 hover:bg-slate-800 text-white"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
