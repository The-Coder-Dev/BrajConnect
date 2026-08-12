"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldDisabled } from "@/lib/onboarding/conditions";

interface RadioFieldProps {
  field: FieldConfig;
  path: string;
}

export function RadioField({ field, path }: RadioFieldProps) {
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
        defaultValue={field.defaultValue ?? ""}
        render={({ field: controllerField }) => (
          <RadioGroup
            value={controllerField.value || ""}
            onValueChange={controllerField.onChange}
            disabled={disabled}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1"
          >
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`${path}-${opt.value}`}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 cursor-pointer transition-colors"
              >
                <RadioGroupItem
                  value={opt.value}
                  id={`${path}-${opt.value}`}
                  className="mt-0.5 text-red-600 focus:ring-red-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 leading-tight">
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="text-xs text-slate-500 mt-0.5">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </RadioGroup>
        )}
      />
      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
