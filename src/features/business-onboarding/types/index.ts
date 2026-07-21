import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { UseFormReturn } from "react-hook-form";

export type StepId =
  | "welcome"
  | "name"
  | "category"
  | "dynamic_fields"
  | "contact"
  | "location"
  | "hours"
  | "social"
  | "brand"
  | "gallery"
  | "about"
  | "documents"
  | "services"
  | "amenities"
  | "review"
  | "success";

export interface SetupStep {
  id: StepId;
  title: string;
  fields: (keyof BusinessSetupInput)[];
}

export interface AssistantContextType {
  currentStepIndex: number;
  steps: SetupStep[];
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: SetupStep;
  goToNextStep: () => Promise<void>;
  goToPreviousStep: () => void;
  goToStep: (index: number) => void;
  saveAsDraft: () => void;
  form: UseFormReturn<any>;
  isSubmitting: boolean;
  submitAssistant: () => Promise<void>;
  registerStepValidator: (stepId: StepId, validator: () => boolean | Promise<boolean>) => void;
  unregisterStepValidator: (stepId: StepId) => void;
}
