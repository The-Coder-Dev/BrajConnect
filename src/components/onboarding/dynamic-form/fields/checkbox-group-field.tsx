"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldDisabled } from "@/lib/onboarding/conditions";
import { cn } from "@/lib/utils";

interface CheckboxGroupFieldProps {
  field: FieldConfig;
  path: string;
}

export function CheckboxGroupField({ field, path }: CheckboxGroupFieldProps) {
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
      <Label className="text-sm font-semibold text-slate-900">
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

          const toggleValue = (val: string) => {
            if (disabled) return;
            if (selectedValues.includes(val)) {
              controllerField.onChange(selectedValues.filter((v) => v !== val));
            } else {
              controllerField.onChange([...selectedValues, val]);
            }
          };

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {field.options?.map((opt) => {
                const isChecked = selectedValues.includes(opt.value);
                const optId = `${path}-${opt.value}`;
                return (
                  <label
                    key={opt.value}
                    htmlFor={optId}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none",
                      isChecked
                        ? "bg-red-50/70 border-red-400 text-red-900 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Checkbox
                      id={optId}
                      checked={isChecked}
                      onCheckedChange={() => toggleValue(opt.value)}
                      disabled={disabled}
                      className="mt-0.5 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-tight">
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span className="text-xs text-slate-500 mt-0.5">
                          {opt.description}
                        </span>
                      )}
                    </div>
                  </label>
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
