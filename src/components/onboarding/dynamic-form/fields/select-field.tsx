"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldDisabled } from "@/lib/onboarding/conditions";

interface SelectFieldProps {
  field: FieldConfig;
  path: string;
}

export function SelectField({ field, path }: SelectFieldProps) {
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
    <div className="space-y-1.5">
      <Label htmlFor={path} className="text-sm font-medium text-slate-700">
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
          <Select
            value={controllerField.value || ""}
            onValueChange={controllerField.onChange}
            disabled={disabled}
          >
            <SelectTrigger id={path} className="w-full h-10 rounded-xl bg-white border-slate-200 focus:ring-red-500">
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{opt.label}</span>
                    {opt.description && (
                      <span className="text-xs text-slate-400">{opt.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
