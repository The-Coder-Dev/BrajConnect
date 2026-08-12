"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldDisabled } from "@/lib/onboarding/conditions";

interface CurrencyFieldProps {
  field: FieldConfig;
  path: string;
}

export function CurrencyField({ field, path }: CurrencyFieldProps) {
  const { register, watch, formState: { errors } } = useFormContext();
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
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
          ₹
        </span>
        <Input
          id={path}
          type="number"
          min={field.validation?.min || 0}
          max={field.validation?.max}
          placeholder={field.placeholder || "0.00"}
          disabled={disabled}
          className="h-10 pl-8 rounded-xl bg-white border-slate-200 focus-visible:ring-red-500 font-medium"
          {...register(path, { valueAsNumber: true })}
        />
      </div>
      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
