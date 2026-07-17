"use client";

import React from "react";
import { useAssistant } from "../../context/assistant-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Save, Loader2 } from "lucide-react";

export function AssistantFooter() {
  const {
    currentStepIndex,
    steps,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isSubmitting,
    submitAssistant,
    saveAsDraft,
    requestLeave,
  } = useAssistant();

  const isReviewStep = currentStepIndex === steps.length - 2;

  // Derive button label for the primary action
  const getPrimaryLabel = () => {
    if (isSubmitting) {
      if (isReviewStep) return "Submitting...";
      if (
        currentStep.id === "brand" ||
        currentStep.id === "gallery" ||
        currentStep.id === "documents"
      )
        return "Uploading...";
      return "Saving...";
    }
    if (isFirstStep) return "Start Setup";
    if (isReviewStep) return "Submit Business";
    return "Continue";
  };

  const handleNext = () => {
    if (isReviewStep) {
      submitAssistant();
    } else {
      goToNextStep();
    }
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <footer className="w-full max-w-3xl px-4 py-3 border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl flex items-center justify-between pointer-events-auto transition-all duration-300">
        {/* Left: Previous */}
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousStep}
              disabled={isSubmitting}
              className="rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </div>

        {/* Right: Save & Exit + Primary CTA */}
        <div className="flex items-center gap-3">
          {/* Save & Exit — hidden on first and review steps */}
          {!isFirstStep && !isReviewStep && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                saveAsDraft();
                requestLeave();
              }}
              className="rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 hidden sm:flex"
            >
              <Save className="mr-2 h-4 w-4" />
              Save &amp; Exit
            </Button>
          )}

          {/* Primary CTA */}
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`rounded-xl px-6 h-10 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-px active:scale-[0.98] active:translate-y-0 min-w-[120px] ${
              isFirstStep || isReviewStep
                ? "bg-linear-to-b from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white shadow-blue-500/20"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {getPrimaryLabel()}
              </>
            ) : isFirstStep ? (
              "Start Setup"
            ) : isReviewStep ? (
              "Submit Business"
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
