"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategoryDynamicFields } from "@/server/actions/category/get-categories";
import { useFormContext } from "react-hook-form";

export type DynamicFieldType = {
  id: string;
  categoryId: string;
  label: string;
  key: string;
  inputType: "text" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date" | "switch";
  required: boolean;
  placeholder: string | null;
  defaultValue: string | null;
  sortOrder: number;
  options: any;
  helpText: string | null;
  validationMetadata: any;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function useDynamicFields(categoryId: string | undefined) {
  const [fields, setFields] = useState<DynamicFieldType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setError, clearErrors } = useFormContext();

  useEffect(() => {
    let cancelled = false;

    async function fetchFields() {
      if (!categoryId) {
        setFields([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getCategoryDynamicFields(categoryId);
        if (!cancelled) {
          setFields(data as any as DynamicFieldType[]);
        }
      } catch (error) {
        console.error("[DynamicFields] Failed to load:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchFields();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  /**
   * Wrapped in useCallback so the reference is stable and does not cause
   * infinite re-registration loops in the step's useEffect dep array.
   */
  const validateDynamicFields = useCallback(
    (values: Record<string, any>) => {
      clearErrors("dynamicFields");
      let isValid = true;

      fields.forEach((field) => {
        if (field.required) {
          const val = values[field.id];
          if (
            val === undefined ||
            val === null ||
            val === "" ||
            (field.inputType === "checkbox" && val === false)
          ) {
            setError(`dynamicFields.${field.id}`, {
              type: "manual",
              message: `${field.label} is required`,
            });
            isValid = false;
          }
        }
      });

      return isValid;
    },
    [fields, setError, clearErrors]
  );

  return {
    fields,
    isLoading,
    validateDynamicFields,
  };
}
