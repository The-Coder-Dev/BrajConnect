"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { AssistantProvider, useAssistant } from "../context/assistant-context";
import { AssistantLayout } from "./layout/assistant-layout";

import { Step1Welcome } from "../steps/step-1-welcome";
import { Step2Name } from "../steps/step-2-name";
import { Step3Category } from "../steps/step-3-category";
import { StepDynamicFields } from "../steps/step-dynamic-fields";
import { Step4Contact } from "../steps/step-4-contact";
import { Step5Location } from "../steps/step-5-location";
import { StepHours } from "../steps/step-hours";
import { StepSocial } from "../steps/step-social";
import { Step6Brand } from "../steps/step-6-brand";
import { StepGallery } from "../steps/step-gallery";
import { Step7About } from "../steps/step-7-about";
import { StepDocuments } from "../steps/step-documents";
import { StepServices } from "../steps/step-services";
import { StepAmenities } from "../steps/step-amenities";
import { Step8Review } from "../steps/step-8-review";
import { Step9Success } from "../steps/step-9-success";

function StepRenderer() {
  const { currentStep } = useAssistant();

  const renderStep = () => {
    switch (currentStep.id) {
      case "welcome": return <Step1Welcome key="welcome" />;
      case "name": return <Step2Name key="name" />;
      case "category": return <Step3Category key="category" />;
      case "dynamic_fields": return <StepDynamicFields key="dynamic_fields" />;
      case "contact": return <Step4Contact key="contact" />;
      case "location": return <Step5Location key="location" />;
      case "hours": return <StepHours key="hours" />;
      case "social": return <StepSocial key="social" />;
      case "brand": return <Step6Brand key="brand" />;
      case "gallery": return <StepGallery key="gallery" />;
      case "about": return <Step7About key="about" />;
      case "documents": return <StepDocuments key="documents" />;
      case "services": return <StepServices key="services" />;
      case "amenities": return <StepAmenities key="amenities" />;
      case "review": return <Step8Review key="review" />;
      case "success": return <Step9Success key="success" />;
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
