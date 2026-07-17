"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessSetupSchema,
  BusinessSetupInput,
  defaultBusinessSetupValues,
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

export interface DraftInfo {
  updatedAt: Date | null;
  stepIndex: number;
}

export interface ExtendedAssistantContextType extends AssistantContextType {
  businessId: string | null;
  setBusinessId: (id: string | null) => void;
  isHydrating: boolean;
  // Draft recovery
  showDraftDialog: boolean;
  draftInfo: DraftInfo | null;
  resumeDraft: () => void;
  startNewDraft: () => void;
  // Leave confirmation
  showLeaveDialog: boolean;
  requestLeave: () => void;
  confirmLeave: () => void;
  cancelLeave: () => void;
}

const AssistantContext = createContext<ExtendedAssistantContextType | undefined>(
  undefined
);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Draft recovery dialog
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftInfo, setDraftInfo] = useState<DraftInfo | null>(null);
  // Holds the loaded draft formData while the dialog is shown
  const pendingDraftData = useRef<any>(null);
  const pendingDraftStepIndex = useRef<number>(0);

  // Leave confirmation dialog
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  /**
   * Step validators: stored in a ref to prevent re-renders when they change.
   * Exposed via stable callback refs so child effects don't loop.
   */
  const stepValidatorsRef = useRef<
    Record<string, () => boolean | Promise<boolean>>
  >({});

  const form = useForm<BusinessSetupInput>({
    resolver: zodResolver(businessSetupSchema) as any,
    defaultValues: defaultBusinessSetupValues as any,
    mode: "onChange",
  });

  // Stable ref to form so we can call form.reset inside effects
  // without listing `form` as a dependency (which changes every render).
  const formRef = useRef(form);
  formRef.current = form;

  const currentStep = SETUP_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === SETUP_STEPS.length - 1;

  // -------------------------------------------------------------------------
  // Hydration — runs ONCE on mount.
  // We intentionally omit `form` from the dep array and use `formRef.current`
  // to avoid the infinite loop that occurs when `form.reset()` triggers a
  // re-render which changes `form`'s identity, re-running this effect.
  // -------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadDraft() {
      try {
        const res = await getDraftBusiness();

        if (cancelled) return;

        if (res.success && res.data) {
          const draft = res.data;

          // Build form data from draft
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
            draft.socials.forEach((s: any) => {
              const idx = (formData.socialLinks as any[]).findIndex(
                (l: any) => l.platform === s.platform
              );
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

          // Read saved step from localStorage
          let savedStepIndex = 0;
          try {
            const uiState = localStorage.getItem("business_setup_ui");
            if (uiState) {
              const parsed = JSON.parse(uiState);
              if (typeof parsed.stepIndex === "number") {
                savedStepIndex = Math.min(parsed.stepIndex, SETUP_STEPS.length - 2);
              }
            }
          } catch {
            // ignore localStorage errors
          }

          setBusinessId(draft.id);
          pendingDraftData.current = formData;
          pendingDraftStepIndex.current = savedStepIndex;

          // Show draft recovery dialog if they were past step 0
          if (savedStepIndex > 0) {
            setDraftInfo({
              updatedAt: draft.updatedAt ? new Date(draft.updatedAt) : null,
              stepIndex: savedStepIndex,
            });
            setShowDraftDialog(true);
            // Keep isHydrating true until dialog is resolved
            return;
          } else {
            // No meaningful progress — auto-restore quietly
            formRef.current.reset(formData);
          }
        }
      } catch (err) {
        console.error("[Onboarding] Hydration error:", err);
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    }

    loadDraft();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once on mount

  // -------------------------------------------------------------------------
  // Draft recovery dialog actions
  // -------------------------------------------------------------------------
  const resumeDraft = useCallback(() => {
    if (pendingDraftData.current) {
      formRef.current.reset(pendingDraftData.current);
      setCurrentStepIndex(pendingDraftStepIndex.current);
    }
    setShowDraftDialog(false);
    setIsHydrating(false);
  }, []);

  const startNewDraft = useCallback(() => {
    // Clear localStorage and start fresh — keep existing businessId (will update via saveBusinessBasic)
    try {
      localStorage.removeItem("business_setup_ui");
    } catch {
      // ignore
    }
    formRef.current.reset(defaultBusinessSetupValues as any);
    setCurrentStepIndex(0);
    setShowDraftDialog(false);
    setIsHydrating(false);
  }, []);

  // -------------------------------------------------------------------------
  // Persist step index to localStorage (only after hydration completes)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isHydrating) {
      try {
        localStorage.setItem(
          "business_setup_ui",
          JSON.stringify({ stepIndex: currentStepIndex })
        );
      } catch {
        // ignore
      }
    }
  }, [currentStepIndex, isHydrating]);

  // -------------------------------------------------------------------------
  // Step validators — stored in a ref, stable callbacks
  // -------------------------------------------------------------------------
  const registerStepValidator = useCallback(
    (stepId: StepId, validator: () => boolean | Promise<boolean>) => {
      stepValidatorsRef.current[stepId] = validator;
    },
    []
  );

  const unregisterStepValidator = useCallback((stepId: StepId) => {
    delete stepValidatorsRef.current[stepId];
  }, []);

  // -------------------------------------------------------------------------
  // Save current step data to server
  // -------------------------------------------------------------------------
  const saveCurrentStepToServer = async (): Promise<boolean> => {
    const data = formRef.current.getValues();
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
      } else if (stepId === "category" && bId) {
        const res = await saveBusinessCategory(bId, data.categoryId);
        if (!res.success) throw new Error(res.error);
      } else if (stepId === "dynamic_fields" && bId) {
        const res = await saveBusinessDynamicFields(bId, data.dynamicFields || {});
        if (!res.success) throw new Error(res.error);
      } else if (stepId === "contact" && bId) {
        const res = await saveBusinessContact(bId, {
          primaryPhone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          website: data.website,
          preferredContactMethod: data.preferredContactMethod,
        });
        if (!res.success) throw new Error(res.error);
      } else if (stepId === "location" && bId) {
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
          googlePlaceId: data.googlePlaceId,
        });
        if (!res.success) throw new Error((res as any).error);
      } else if (stepId === "hours" && bId) {
        const res = await saveBusinessHours(bId, data.hours);
        if (!res.success) throw new Error((res as any).error);
      } else if (stepId === "social" && bId) {
        const validLinks = data.socialLinks
          .filter((l: any) => l.url && l.url.trim().length > 0)
          .map((l: any) => ({ platform: l.platform, url: l.url as string }));
        const res = await saveBusinessSocials(bId, validLinks);
        if (!res.success) throw new Error((res as any).error);
      } else if (stepId === "about" && bId) {
        const res = await saveBusinessBasic(bId, {
          shortDescription: data.shortDescription,
          description: data.description,
          establishedYear: data.establishedYear,
        });
        if (!res.success) throw new Error((res as any).error);
      }
      // Brand, Gallery, Documents are handled by their custom step validators.

      return true;
    } catch (e: any) {
      toast.error(e.message || "Failed to save. Please try again.");
      return false;
    }
  };

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  const goToNextStep = useCallback(async () => {
    // 1. Run custom step validator (brand uploads, dynamic field checks, etc.)
    const customValidator = stepValidatorsRef.current[currentStep.id];
    if (customValidator) {
      let isValid: boolean;
      try {
        setIsSubmitting(true);
        isValid = await customValidator();
      } catch (e: any) {
        toast.error(e.message || "Validation failed. Please check your inputs.");
        setIsSubmitting(false);
        return;
      } finally {
        setIsSubmitting(false);
      }
      if (!isValid) return;
    }

    // 2. Zod field validation
    const fieldsToValidate = currentStep.fields;
    if (fieldsToValidate.length > 0) {
      const isValid = await formRef.current.trigger(fieldsToValidate as any[]);
      if (!isValid) {
        const errors = formRef.current.formState.errors;
        const firstErrorField = fieldsToValidate.find((f) => (errors as any)[f]);
        const firstErrorMsg = firstErrorField
          ? (errors as any)[firstErrorField]?.message ||
            (errors as any)[firstErrorField]?.root?.message
          : null;
        toast.error(
          firstErrorMsg || "Please fill in all required fields before continuing."
        );
        // Scroll to first error field
        try {
          const el = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement | null;
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
          }
        } catch {
          // ignore scroll errors
        }
        return;
      }
    }

    // 3. Persist to DB (skip for welcome, review, success)
    if (
      currentStep.id !== "welcome" &&
      currentStep.id !== "success" &&
      currentStep.id !== "review"
    ) {
      setIsSubmitting(true);
      const saved = await saveCurrentStepToServer();
      setIsSubmitting(false);
      if (!saved) return;
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isLastStep]);

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
    toast.success("Your progress is saved. Returning to dashboard...");
  }, []);

  // -------------------------------------------------------------------------
  // Leave confirmation
  // -------------------------------------------------------------------------
  const requestLeave = useCallback(() => {
    if (businessId) {
      setShowLeaveDialog(true);
    } else {
      window.location.href = "/dashboard";
    }
  }, [businessId]);

  const confirmLeave = useCallback(() => {
    setShowLeaveDialog(false);
    window.location.href = "/dashboard";
  }, []);

  const cancelLeave = useCallback(() => {
    setShowLeaveDialog(false);
  }, []);

  // -------------------------------------------------------------------------
  // Final submission
  // -------------------------------------------------------------------------
  const submitAssistant = useCallback(async () => {
    try {
      setIsSubmitting(true);

      if (!businessId) {
        toast.error("No business found to submit.");
        return;
      }

      const res = await submitBusinessForReview(businessId);
      if (!res.success) throw new Error((res as any).error);

      // Clear UI state
      try {
        localStorage.removeItem("business_setup_ui");
      } catch {
        // ignore
      }

      setCurrentStepIndex(SETUP_STEPS.length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit business details.");
    } finally {
      setIsSubmitting(false);
    }
  }, [businessId]);

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
        setBusinessId,
        isHydrating,
        showDraftDialog,
        draftInfo,
        resumeDraft,
        startNewDraft,
        showLeaveDialog,
        requestLeave,
        confirmLeave,
        cancelLeave,
      }}
    >
      <FormProvider {...form}>
        {isHydrating ? (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8FAFC]">
            <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Loading your draft...</p>
          </div>
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
