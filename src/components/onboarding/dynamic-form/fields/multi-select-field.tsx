"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldDisabled } from "@/lib/onboarding/conditions";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectFieldProps {
  field: FieldConfig;
  path: string;
}

export function MultiSelectField({ field, path }: MultiSelectFieldProps) {
  const { control, watch, formState: { errors } } = useFormContext();
  const formValues = watch();
  const disabled = isFieldDisabled(field, formValues);

  const pathParts = path.split(".");
  let currentError: unknown = errors;
  for (const part of pathParts) {
    if (currentError && typeof currentError === "object") {
      currentError = (currentError as Record<string, unknown>)[part];
    } else {
      currentError = undefined;
      break;
    }
  }
  const errorMessage = (currentError as { message?: string })?.message;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </Label>
      {field.description && (
        <p className="text-xs text-slate-500">{field.description}</p>
      )}
      <Controller
        control={control}
        name={path}
        defaultValue={field.defaultValue ?? []}
        render={({ field: controllerField }) => {
          const selectedValues: string[] = Array.isArray(controllerField.value)
            ? controllerField.value
            : [];

          const toggleOption = (val: string) => {
            if (disabled) return;
            if (selectedValues.includes(val)) {
              controllerField.onChange(selectedValues.filter((v) => v !== val));
            } else {
              controllerField.onChange([...selectedValues, val]);
            }
          };

          return (
            <div className="flex flex-wrap gap-2 pt-1">
              {field.options?.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border",
                      isSelected
                        ? "bg-red-50 border-red-400 text-red-700 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          );
        }}
      />
      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
