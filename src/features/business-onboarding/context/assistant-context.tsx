"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  businessSetupSchema, 
  BusinessSetupInput, 
  defaultBusinessSetupValues 
} from "@/lib/validations/business/setup";
import { AssistantContextType } from "../types";
import { SETUP_STEPS } from "../constants";
import { toast } from "sonner";

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(businessSetupSchema) as any,
    defaultValues: defaultBusinessSetupValues as any,
    mode: "onChange",
  });

  const currentStep = SETUP_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === SETUP_STEPS.length - 1;

  const goToNextStep = useCallback(async () => {
    // Validate current step fields before proceeding
    const fieldsToValidate = currentStep.fields;
    
    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, form, isLastStep]);

  const goToPreviousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isFirstStep]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < SETUP_STEPS.length) {
      setCurrentStepIndex(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const saveAsDraft = useCallback(() => {
    const data = form.getValues();
    localStorage.setItem("business_setup_draft", JSON.stringify({
      data,
      stepIndex: currentStepIndex
    }));
    toast.success("Progress saved as draft.");
  }, [form, currentStepIndex]);

  // Try to load draft on mount
  React.useEffect(() => {
    try {
      const draft = localStorage.getItem("business_setup_draft");
      if (draft) {
        const { data, stepIndex } = JSON.parse(draft);
        form.reset(data);
        if (stepIndex) setCurrentStepIndex(stepIndex);
        toast("Draft restored successfully.");
      }
    } catch (e) {
      console.error("Failed to parse draft", e);
    }
  }, [form]);

  const submitAssistant = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fill in all required fields correctly.");
        return;
      }
      
      const data = form.getValues();
      console.log("Submitting business setup data (Status will become pending_review):", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear draft on successful submit
      localStorage.removeItem("business_setup_draft");
      
      // Move to success step
      setCurrentStepIndex(SETUP_STEPS.length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      
    } catch (error) {
      toast.error("Failed to submit business details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  return (
    <AssistantContext.Provider
      value={{
        currentStepIndex,
        steps: SETUP_STEPS,
        isFirstStep,
        isLastStep,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        saveAsDraft,
        form,
        isSubmitting,
        submitAssistant,
      }}
    >
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error("useAssistant must be used within an AssistantProvider");
  }
  return context;
}
