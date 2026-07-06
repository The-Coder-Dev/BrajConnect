"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { AssistantProvider, useAssistant } from "../context/assistant-context";
import { AssistantLayout } from "./layout/assistant-layout";

import { Step1Welcome } from "../steps/step-1-welcome";
import { Step2Name } from "../steps/step-2-name";
import { Step3Category } from "../steps/step-3-category";
import { Step4Contact } from "../steps/step-4-contact";
import { Step5Location } from "../steps/step-5-location";
import { Step6Brand } from "../steps/step-6-brand";
import { Step7About } from "../steps/step-7-about";
import { Step8Review } from "../steps/step-8-review";
import { Step9Success } from "../steps/step-9-success";

function StepRenderer() {
  const { currentStep } = useAssistant();

  const renderStep = () => {
    switch (currentStep.id) {
      case "welcome": return <Step1Welcome key="step-1" />;
      case "name": return <Step2Name key="step-2" />;
      case "category": return <Step3Category key="step-3" />;
      case "contact": return <Step4Contact key="step-4" />;
      case "location": return <Step5Location key="step-5" />;
      case "brand": return <Step6Brand key="step-6" />;
      case "about": return <Step7About key="step-7" />;
      case "review": return <Step8Review key="step-8" />;
      case "success": return <Step9Success key="step-9" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderStep()}
    </AnimatePresence>
  );
}

export function BusinessSetupAssistant() {
  return (
    <AssistantProvider>
      <AssistantLayout>
        <StepRenderer />
      </AssistantLayout>
    </AssistantProvider>
  );
}
