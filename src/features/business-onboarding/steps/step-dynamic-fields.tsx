"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext, Controller } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAssistant } from "../context/assistant-context";
import { getCategoryConfig } from "@/config/business-categories";
import { DynamicCategoryForm } from "@/components/onboarding/dynamic-form";
import { validateCategorySubmission } from "@/lib/onboarding/validation";
import { useDynamicFields, DynamicFieldType } from "../hooks/useDynamicFields";
import { getCategories } from "@/server/actions/category/get-categories";

export function StepDynamicFields() {
  const { register, watch, control, getValues, setError, clearErrors, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const categoryId = watch("categoryId");
  const { registerStepValidator, unregisterStepValidator } = useAssistant();

  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [isResolvingCategory, setIsResolvingCategory] = useState(true);

  // 1. Resolve category configuration
  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (!categoryId) {
        setIsResolvingCategory(false);
        return;
      }

      // Check if ID is already a slug or direct config key
      const directConfig = getCategoryConfig(categoryId);
      if (directConfig) {
        if (!cancelled) {
          setCategorySlug(directConfig.slug);
          setIsResolvingCategory(false);
        }
        return;
      }

      // Query database categories to match ID to slug
      try {
        const allCats = await getCategories();
        const found = allCats.find((c) => c.id === categoryId);
        if (!cancelled) {
          setCategorySlug(found?.slug || categoryId);
          setIsResolvingCategory(false);
        }
      } catch {
        if (!cancelled) {
          setCategorySlug(categoryId);
          setIsResolvingCategory(false);
        }
      }
    }

    resolve();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const activeCategoryConfig = getCategoryConfig(categorySlug) || getCategoryConfig(categoryId);

  // 2. Legacy fallback hook for unconfigured legacy categories
  const { fields: legacyFields, isLoading: legacyLoading, validateDynamicFields: validateLegacyFields } = useDynamicFields(
    !activeCategoryConfig ? categoryId : undefined
  );

  // 3. Register custom step validator
  useEffect(() => {
    registerStepValidator("dynamic_fields", () => {
      if (activeCategoryConfig) {
        clearErrors("categoryData");
        const categoryValues = (getValues("categoryData") as Record<string, unknown>) || {};
        const validationResult = validateCategorySubmission(activeCategoryConfig, categoryValues);

        if (!validationResult.success) {
          validationResult.issues.forEach((issue) => {
            setError(`categoryData.${issue.path}` as any, {
              type: "manual",
              message: issue.message,
            });
          });
          return false;
        }
        return true;
      }

      // Fallback for legacy categories
      const legacyValues = (getValues("dynamicFields") as Record<string, unknown>) || {};
      return validateLegacyFields(legacyValues);
    });

    return () => {
      unregisterStepValidator("dynamic_fields");
    };
  }, [registerStepValidator, unregisterStepValidator, activeCategoryConfig, getValues, setError, clearErrors, validateLegacyFields]);

  const renderLegacyField = (field: DynamicFieldType) => {
    const error = (errors?.dynamicFields as Record<string, { message?: string }> | undefined)?.[field.id];

    switch (field.inputType) {
      case "text":
      case "number":
      case "date":
        return (
          <>
            <Input
              type={field.inputType}
              placeholder={field.placeholder || ""}
              className="h-10 rounded-xl"
              {...register(`dynamicFields.${field.id}`)}
            />
            {error && <p className="text-red-500 text-xs font-medium">{error.message}</p>}
          </>
        );
      case "textarea":
        return (
          <>
            <Textarea
              placeholder={field.placeholder || ""}
              className="rounded-xl min-h-[90px]"
              {...register(`dynamicFields.${field.id}`)}
            />
            {error && <p className="text-red-500 text-xs font-medium">{error.message}</p>}
          </>
        );
      case "checkbox":
      case "switch":
        return (
          <Controller
            control={control}
            name={`dynamicFields.${field.id}`}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id={field.id}
                  checked={Boolean(controllerField.value)}
                  onCheckedChange={controllerField.onChange}
                />
                <Label htmlFor={field.id} className="text-sm font-normal">Yes</Label>
              </div>
            )}
          />
        );
      case "select":
        return (
          <Controller
            control={control}
            name={`dynamicFields.${field.id}`}
            render={({ field: controllerField }) => (
              <>
                <Select onValueChange={controllerField.onChange} value={String(controllerField.value || "")}>
                  <SelectTrigger className="w-full h-10 rounded-xl">
                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(field.options) ? field.options.map((opt: string, i: number) => (
                      <SelectItem key={i} value={opt}>{opt}</SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
                {error && <p className="text-red-500 text-xs font-medium">{error.message}</p>}
              </>
            )}
          />
        );
      case "radio":
        return (
          <Controller
            control={control}
            name={`dynamicFields.${field.id}`}
            render={({ field: controllerField }) => (
              <>
                <RadioGroup
                  onValueChange={controllerField.onChange}
                  value={String(controllerField.value || "")}
                  className="flex flex-col space-y-2 mt-2"
                >
                  {Array.isArray(field.options) ? field.options.map((opt: string, i: number) => (
                    <div className="flex items-center space-x-2" key={i}>
                      <RadioGroupItem value={opt} id={`${field.id}-${i}`} />
                      <Label htmlFor={`${field.id}-${i}`}>{opt}</Label>
                    </div>
                  )) : null}
                </RadioGroup>
                {error && <p className="text-red-500 text-xs font-medium">{error.message}</p>}
              </>
            )}
          />
        );

      default:
        return null;
    }
  };

  if (isResolvingCategory) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-3xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>
          {activeCategoryConfig
            ? `${activeCategoryConfig.name} Details`
            : "Specific Business Details"}
        </AssistantQuestion>
        <p className="text-slate-500 text-sm mt-1.5">
          {activeCategoryConfig
            ? activeCategoryConfig.description
            : "Provide category-specific details to help customers discover your offerings."}
        </p>

        <div className="mt-8">
          {activeCategoryConfig ? (
            <DynamicCategoryForm categoryConfig={activeCategoryConfig} />
          ) : legacyLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : legacyFields.length === 0 ? (
            <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm">No additional specific details required for this category.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {legacyFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderLegacyField(field)}
                  {field.helpText && (
                    <p className="text-xs text-slate-500">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </AssistantCard>
    </motion.div>
  );
}
