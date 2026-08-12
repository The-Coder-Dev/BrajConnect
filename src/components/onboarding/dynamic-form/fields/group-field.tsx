"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldVisible } from "@/lib/onboarding/conditions";
import { FieldRenderer } from "../field-renderer";

interface GroupFieldProps {
  field: FieldConfig;
  path: string;
}

export function GroupField({ field, path }: GroupFieldProps) {
  const { watch } = useFormContext();
  const formValues = watch();

  if (!field.fields || field.fields.length === 0) {
    return null;
  }

  // Filter visible sub-fields
  const visibleSubFields = field.fields.filter((sub) =>
    isFieldVisible(sub, formValues)
  );

  if (visibleSubFields.length === 0) {
    return null;
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4 my-2">
      <div className="border-b border-slate-200/60 pb-2">
        <h5 className="text-sm font-semibold text-slate-900">{field.label}</h5>
        {field.description && (
          <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleSubFields.map((subField) => (
          <div
            key={subField.id}
            className={
              subField.type === "textarea" ||
              subField.type === "checkbox_group" ||
              subField.type === "group" ||
              subField.type === "repeatable_group"
                ? "col-span-1 sm:col-span-2"
                : "col-span-1"
            }
          >
            <FieldRenderer
              field={subField}
              pathPrefix={path}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
