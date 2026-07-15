"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  businessSetupSchema, 
  BusinessSetupInput, 
  defaultBusinessSetupValues 
} from "@/lib/validations/business/setup";
import { AssistantContextType, StepId } from "../types";
import { SETUP_STEPS } from "../constants";
import { toast } from "sonner";

// Server Actions
import { getDraftBusiness } from "@/server/actions/business/onboarding/get-draft";
import { createDraftBusiness } from "@/server/actions/business/onboarding/create-draft";
import { saveBusinessBasic } from "@/server/actions/business/onboarding/save-basic";
import { saveBusinessCategory } from "@/server/actions/business/onboarding/save-category";
import { saveBusinessDynamicFields } from "@/server/actions/business/onboarding/save-dynamic-fields";
import { saveBusinessContact } from "@/server/actions/business/onboarding/save-contact";
import { saveBusinessLocation } from "@/server/actions/business/onboarding/save-location";
import { saveBusinessHours } from "@/server/actions/business/onboarding/save-hours";
import { saveBusinessSocials } from "@/server/actions/business/onboarding/save-socials";
import { submitBusinessForReview } from "@/server/actions/business/onboarding/submit";

export interface ExtendedAssistantContextType extends AssistantContextType {
  businessId: string | null;
  setBusinessId: (id: string | null) => void;
}

const AssistantContext = createContext<ExtendedAssistantContextType | undefined>(undefined);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepValidators, setStepValidators] = useState<Record<string, () => boolean | Promise<boolean>>>({});
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  const form = useForm<any>({
    resolver: zodResolver(businessSetupSchema) as any,
    defaultValues: defaultBusinessSetupValues as any,
    mode: "onChange",
  });

  const currentStep = SETUP_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === SETUP_STEPS.length - 1;

  // Hydrate from Database on mount
  useEffect(() => {
    async function loadDraft() {
      try {
        const res = await getDraftBusiness();
        if (res.success && res.data) {
          const draft = res.data;
          setBusinessId(draft.id);
          
          // Populate Form
          const formData: any = { ...defaultBusinessSetupValues };
          
          if (draft.name) formData.name = draft.name;
          if (draft.shortDescription) formData.shortDescription = draft.shortDescription;
          if (draft.fullDescription) formData.description = draft.fullDescription;
          if (draft.establishedYear) formData.establishedYear = draft.establishedYear;
          
          if (draft.businessCategories && draft.businessCategories.length > 0) {
            formData.categoryId = draft.businessCategories[0].categoryId;
          }

          if (draft.contact) {
            formData.phone = draft.contact.primaryPhone || "";
            formData.whatsapp = draft.contact.whatsapp || "";
            formData.email = draft.contact.email || "";
            formData.website = draft.contact.website || "";
            formData.preferredContactMethod = draft.contact.preferredContactMethod;
          }

          if (draft.location) {
            formData.country = draft.location.country;
            formData.state = draft.location.state;
            formData.district = draft.location.district || "";
            formData.city = draft.location.city;
            formData.locality = draft.location.locality || "";
            formData.address = draft.location.address;
            formData.postalCode = draft.location.postalCode;
            formData.latitude = draft.location.latitude;
            formData.longitude = draft.location.longitude;
            formData.googlePlaceId = draft.location.googlePlaceId || "";
          }

          if (draft.hours && draft.hours.length > 0) {
            formData.hours = draft.hours.map((h: any) => ({
              dayOfWeek: h.dayOfWeek,
              isClosed: h.isClosed,
              is24Hours: h.is24Hours,
              openTime: h.openTime || "09:00",
              closeTime: h.closeTime || "18:00",
            }));
          }

          if (draft.socials && draft.socials.length > 0) {
            // Keep default array and override matched platforms
            draft.socials.forEach((s: any) => {
              const idx = formData.socialLinks.findIndex((l: any) => l.platform === s.platform);
              if (idx >= 0) formData.socialLinks[idx].url = s.url;
            });
          }

          if (draft.businessFields) {
            const dynamicFields: Record<string, string> = {};
            draft.businessFields.forEach((f: any) => {
              dynamicFields[f.dynamicFieldId] = f.value;
            });
            formData.dynamicFields = dynamicFields;
          }

          // Restore UI State from local storage if available
          const uiState = localStorage.getItem("business_setup_ui");
          if (uiState) {
            const parsed = JSON.parse(uiState);
            if (parsed.stepIndex !== undefined) {
              setCurrentStepIndex(parsed.stepIndex);
            }
          }

          form.reset(formData);
        }
      } catch (err) {
        console.error("Hydration error:", err);
      } finally {
        setIsHydrating(false);
      }
    }
    loadDraft();
  }, [form]);

  // Persist UI step state
  useEffect(() => {
    if (!isHydrating) {
      localStorage.setItem("business_setup_ui", JSON.stringify({ stepIndex: currentStepIndex }));
    }
  }, [currentStepIndex, isHydrating]);

  const registerStepValidator = useCallback((stepId: StepId, validator: () => boolean | Promise<boolean>) => {
    setStepValidators(prev => ({ ...prev, [stepId]: validator }));
  }, []);

  const unregisterStepValidator = useCallback((stepId: StepId) => {
    setStepValidators(prev => {
      const newValidators = { ...prev };
      delete newValidators[stepId];
      return newValidators;
    });
  }, []);

  const saveCurrentStepToServer = async (): Promise<boolean> => {
    const data = form.getValues();
    const stepId = currentStep.id;
    let bId = businessId;

    try {
      if (stepId === "name") {
        if (!bId) {
          const res = await createDraftBusiness(data.name);
          if (!res.success) throw new Error(res.error);
          bId = res.businessId as string;
          setBusinessId(bId);
        } else {
          const res = await saveBusinessBasic(bId, { name: data.name });
          if (!res.success) throw new Error(res.error);
        }
      } 
      else if (stepId === "category" && bId) {
        const res = await saveBusinessCategory(bId, data.categoryId);
        if (!res.success) throw new Error(res.error);
      }
      else if (stepId === "dynamic_fields" && bId) {
        const res = await saveBusinessDynamicFields(bId, data.dynamicFields || {});
        if (!res.success) throw new Error(res.error);
      }
      else if (stepId === "contact" && bId) {
        const res = await saveBusinessContact(bId, {
          primaryPhone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          website: data.website,
          preferredContactMethod: data.preferredContactMethod
        });
        if (!res.success) throw new Error(res.error);
      }
      else if (stepId === "location" && bId) {
        const res = await saveBusinessLocation(bId, {
          country: data.country,
          state: data.state,
          district: data.district,
          city: data.city,
          locality: data.locality,
          address: data.address,
          postalCode: data.postalCode,
          latitude: data.latitude,
          longitude: data.longitude,
          googlePlaceId: data.googlePlaceId
        });
        if (!res.success) throw new Error((res as any).error);
      }
      else if (stepId === "hours" && bId) {
        const res = await saveBusinessHours(bId, data.hours);
        if (!res.success) throw new Error((res as any).error);
      }
      else if (stepId === "social" && bId) {
        const res = await saveBusinessSocials(bId, data.socialLinks);
        if (!res.success) throw new Error((res as any).error);
      }
      else if (stepId === "about" && bId) {
        const res = await saveBusinessBasic(bId, {
          shortDescription: data.shortDescription,
          description: data.description,
          establishedYear: data.establishedYear
        });
        if (!res.success) throw new Error((res as any).error);
      }
      // Note: Brand, Gallery, and Documents use their own FormData uploads inside their custom validators or step files.
      // So their logic will be handled inside stepValidators.

      return true;
    } catch (e: any) {
      toast.error(e.message || "Failed to save data. Please try again.");
      return false;
    }
  };

  const goToNextStep = useCallback(async () => {
    // Custom validation
    const customValidator = stepValidators[currentStep.id];
    if (customValidator) {
      const isValid = await customValidator();
      if (!isValid) return;
    }

    // Zod validation
    const fieldsToValidate = currentStep.fields;
    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    // Persist to DB
    if (currentStep.id !== "welcome" && currentStep.id !== "success" && currentStep.id !== "review") {
      setIsSubmitting(true);
      const saved = await saveCurrentStepToServer();
      setIsSubmitting(false);
      if (!saved) return;
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, form, isLastStep, stepValidators, businessId]);

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
    toast.success("Progress is automatically saved to the cloud.");
    window.location.href = "/dashboard";
  }, []);

  const submitAssistant = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fill in all required fields correctly.");
        return;
      }
      
      if (!businessId) {
        toast.error("No business found to submit.");
        return;
      }

      const res = await submitBusinessForReview(businessId);
      if (!res.success) throw new Error((res as any).error);

      // Clear UI state
      localStorage.removeItem("business_setup_ui");
      
      setCurrentStepIndex(SETUP_STEPS.length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit business details.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, businessId]);

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
        registerStepValidator,
        unregisterStepValidator,
        businessId,
        setBusinessId
      }}
    >
      <FormProvider {...form}>
        {isHydrating ? (
           <div className="flex justify-center p-12">Loading draft...</div>
        ) : (
           children
        )}
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
