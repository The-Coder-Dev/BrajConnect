"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldDisabled } from "@/lib/onboarding/conditions";

interface CheckboxFieldProps {
  field: FieldConfig;
  path: string;
}

export function CheckboxField({ field, path }: CheckboxFieldProps) {
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
    <div className="space-y-1">
      <Controller
        control={control}
        name={path}
        defaultValue={field.defaultValue ?? false}
        render={({ field: controllerField }) => (
          <label
            htmlFor={path}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 cursor-pointer transition-colors"
          >
            <Checkbox
              id={path}
              checked={Boolean(controllerField.value)}
              onCheckedChange={controllerField.onChange}
              disabled={disabled}
              className="mt-0.5 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900 leading-tight">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </span>
              {field.description && (
                <span className="text-xs text-slate-500 mt-0.5">
                  {field.description}
                </span>
              )}
            </div>
          </label>
        )}
      />
      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
