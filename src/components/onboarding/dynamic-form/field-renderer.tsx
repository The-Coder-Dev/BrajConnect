"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldVisible } from "@/lib/onboarding/conditions";

import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";
import { NumberField } from "./fields/number-field";
import { CurrencyField } from "./fields/currency-field";
import { SelectField } from "./fields/select-field";
import { MultiSelectField } from "./fields/multi-select-field";
import { RadioField } from "./fields/radio-field";
import { CheckboxField } from "./fields/checkbox-field";
import { CheckboxGroupField } from "./fields/checkbox-group-field";
import { SwitchField } from "./fields/switch-field";
import { DateField } from "./fields/date-field";
import { TimeField } from "./fields/time-field";
import { ImageUploadField } from "./fields/image-upload-field";
import { GroupField } from "./fields/group-field";
import { RepeatableGroupField } from "./fields/repeatable-group-field";

interface FieldRendererProps {
  field: FieldConfig;
  pathPrefix?: string;
}

export function FieldRenderer({ field, pathPrefix }: FieldRendererProps) {
  const { watch } = useFormContext();
  const formValues = watch();

  // Evaluate visibility against root form values
  const visible = isFieldVisible(field, formValues);
  if (!visible) {
    return null;
  }

  const fieldPath = pathPrefix ? `${pathPrefix}.${field.name}` : `categoryData.${field.name}`;

  switch (field.type) {
    case "text":
      return <TextField field={field} path={fieldPath} />;
    case "textarea":
      return <TextareaField field={field} path={fieldPath} />;
    case "number":
      return <NumberField field={field} path={fieldPath} />;
    case "currency":
      return <CurrencyField field={field} path={fieldPath} />;
    case "select":
      return <SelectField field={field} path={fieldPath} />;
    case "multi_select":
      return <MultiSelectField field={field} path={fieldPath} />;
    case "radio":
      return <RadioField field={field} path={fieldPath} />;
    case "checkbox":
      return <CheckboxField field={field} path={fieldPath} />;
    case "checkbox_group":
      return <CheckboxGroupField field={field} path={fieldPath} />;
    case "switch":
      return <SwitchField field={field} path={fieldPath} />;
    case "date":
      return <DateField field={field} path={fieldPath} />;
    case "time":
      return <TimeField field={field} path={fieldPath} />;
    case "image":
    case "file":
      return <ImageUploadField field={field} path={fieldPath} />;
    case "group":
      return <GroupField field={field} path={fieldPath} />;
    case "repeatable_group":
      return <RepeatableGroupField field={field} path={fieldPath} />;
    default:
      return <TextField field={field} path={fieldPath} />;
  }
}
