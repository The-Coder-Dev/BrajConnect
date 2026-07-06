"use client";

import React from "react";
import { useAssistant } from "../../context/assistant-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Save } from "lucide-react";

export function AssistantFooter() {
  const { 
    currentStepIndex, 
    steps, 
    goToNextStep, 
    goToPreviousStep, 
    isFirstStep,
    isSubmitting,
    submitAssistant
  } = useAssistant();

  const isReviewStep = currentStepIndex === steps.length - 2;

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
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button variant="ghost" size="sm" onClick={goToPreviousStep} className="rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isFirstStep && !isReviewStep && (
            <Button variant="ghost" size="sm" className="rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 hidden sm:flex">
              <Save className="mr-2 h-4 w-4" />
              Save & Exit
            </Button>
          )}
          
          <Button 
            onClick={handleNext} 
            disabled={isSubmitting}
            className={`rounded-xl px-6 h-10 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-px active:scale-[0.98] active:translate-y-0 ${
              isFirstStep || isReviewStep 
                ? 'bg-linear-to-b from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white shadow-blue-500/20' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isSubmitting ? (
              "Processing..."
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
