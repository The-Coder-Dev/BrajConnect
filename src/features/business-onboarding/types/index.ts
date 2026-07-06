import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { UseFormReturn } from "react-hook-form";

export type StepId = 
  | "welcome" 
  | "name" 
  | "category" 
  | "contact" 
  | "location" 
  | "brand" 
  | "about" 
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
  form: UseFormReturn<BusinessSetupInput>;
  isSubmitting: boolean;
  submitAssistant: () => Promise<void>;
}
