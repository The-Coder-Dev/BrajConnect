"use client";

import React from "react";
import { useAssistant } from "../../context/assistant-context";
import { AssistantProgress } from "../ui/assistant-progress";

export function AssistantHeader() {
  const { currentStepIndex, steps } = useAssistant();
  
  // Don't show progress on first step (Welcome) or last step (Success)
  const showProgress = currentStepIndex > 0 && currentStepIndex < steps.length - 1;
  const progressPercentage = showProgress 
    ? Math.round((currentStepIndex / (steps.length - 2)) * 100) 
    : 0;

  return (
    <header className="w-full h-20 flex items-center justify-center border-b border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] sticky top-0 z-40">
      <div className="w-full max-w-3xl px-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg tracking-tight text-slate-900">
            {showProgress ? steps[currentStepIndex].title : "Business Setup Assistant"}
          </h2>
          {showProgress && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">Step {currentStepIndex} of {steps.length - 2}</p>
          )}
        </div>

        {showProgress && (
          <div className="flex flex-col items-end gap-1.5 w-48">
            <div className="w-full">
              <AssistantProgress value={progressPercentage} />
            </div>
            <div className="flex items-center justify-between w-full text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <span>{progressPercentage}% Completed</span>
              <span>~3 Min</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
