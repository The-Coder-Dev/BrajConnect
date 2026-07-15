"use client";

import { useState, useEffect } from "react";
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
  const { formState, setError, clearErrors } = useFormContext();

  useEffect(() => {
    async function fetchFields() {
      if (!categoryId) {
        setFields([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getCategoryDynamicFields(categoryId);
        // Cast is necessary since the DB schema type might differ slightly from the explicit type we defined
        setFields(data as any as DynamicFieldType[]);
      } catch (error) {
        console.error("Failed to load dynamic fields", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFields();
  }, [categoryId]);

  const validateDynamicFields = (values: Record<string, any>) => {
    clearErrors("dynamicFields");
    let isValid = true;
    
    fields.forEach(field => {
      if (field.required) {
        const val = values[field.key];
        if (val === undefined || val === null || val === "" || (field.inputType === "checkbox" && val === false)) {
          setError(`dynamicFields.${field.key}`, {
            type: "manual",
            message: `${field.label} is required`
          });
          isValid = false;
        }
      }
    });
    
    return isValid;
  };

  return {
    fields,
    isLoading,
    validateDynamicFields
  };
}
