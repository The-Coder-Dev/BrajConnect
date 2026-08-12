"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldVisible } from "@/lib/onboarding/conditions";
import { FieldRenderer } from "../field-renderer";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface RepeatableGroupFieldProps {
  field: FieldConfig;
  path: string;
}

export function RepeatableGroupField({ field, path }: RepeatableGroupFieldProps) {
  const { control, watch } = useFormContext();
  const formValues = watch();

  const { fields: arrayFields, append, remove } = useFieldArray({
    control,
    name: path,
  });

  const subFields = field.fields || [];

  const handleAdd = () => {
    if (field.maxItems && arrayFields.length >= field.maxItems) return;
    const defaultItem: Record<string, unknown> = {};
    for (const sub of subFields) {
      defaultItem[sub.name] = sub.defaultValue ?? (sub.type === "switch" ? false : "");
    }
    append(defaultItem);
  };

  return (
    <div className="space-y-4 my-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </h4>
          {field.description && (
            <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>
          )}
        </div>
        {(!field.maxItems || arrayFields.length < field.maxItems) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-8 px-3 rounded-xl border-dashed border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add {field.label.replace(/s$/, "")}
          </Button>
        )}
      </div>

      {arrayFields.length === 0 ? (
        <div className="py-6 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-xs text-slate-500 font-medium">
            No {field.label.toLowerCase()} added yet.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAdd}
            className="mt-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add the first one
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {arrayFields.map((item, index) => {
            const itemPath = `${path}.${index}`;
            const visibleSubFields = subFields.filter((sub) =>
              isFieldVisible(sub, formValues)
            );

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 relative group"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    #{index + 1} {field.label.replace(/s$/, "")}
                  </span>
                  {(!field.minItems || arrayFields.length > field.minItems) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
                        pathPrefix={itemPath}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
