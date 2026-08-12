"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { CategoryConfig } from "@/lib/onboarding/types";
import { isSectionVisible } from "@/lib/onboarding/conditions";
import { FieldRenderer } from "./field-renderer";

interface DynamicCategoryFormProps {
  categoryConfig: CategoryConfig;
}

export function DynamicCategoryForm({ categoryConfig }: DynamicCategoryFormProps) {
  const { watch } = useFormContext();
  const formValues = watch();

  const visibleSections = categoryConfig.sections.filter((section) =>
    isSectionVisible(section, formValues)
  );

  return (
    <div className="space-y-6">
      {visibleSections.map((section, sIdx) => {
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: sIdx * 0.05 }}
            className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {section.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              {section.fields.map((field) => {
                const isFullWidth =
                  field.type === "textarea" ||
                  field.type === "checkbox_group" ||
                  field.type === "group" ||
                  field.type === "repeatable_group" ||
                  field.type === "radio";

                return (
                  <div
                    key={field.id}
                    className={isFullWidth ? "col-span-1 sm:col-span-2" : "col-span-1"}
                  >
                    <FieldRenderer field={field} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
