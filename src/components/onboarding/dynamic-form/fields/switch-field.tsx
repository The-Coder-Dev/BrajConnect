"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldDisabled } from "@/lib/onboarding/conditions";

interface SwitchFieldProps {
  field: FieldConfig;
  path: string;
}

export function SwitchField({ field, path }: SwitchFieldProps) {
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
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col pr-4">
              <Label htmlFor={path} className="text-sm font-medium text-slate-800 cursor-pointer">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              {field.description && (
                <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>
              )}
            </div>
            <Switch
              id={path}
              checked={Boolean(controllerField.value)}
              onCheckedChange={controllerField.onChange}
              disabled={disabled}
              className="data-[state=checked]:bg-red-600"
            />
          </div>
        )}
      />
      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
