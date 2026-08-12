/**
 * Category-Driven Dynamic Business Onboarding Types
 * Strict, type-safe models for fields, conditions, options, validations, sections, and category configurations.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "select"
  | "multi_select"
  | "radio"
  | "checkbox"
  | "checkbox_group"
  | "switch"
  | "date"
  | "time"
  | "image"
  | "file"
  | "group"
  | "repeatable_group";

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "includes"
  | "not_includes"
  | "is_true"
  | "is_false"
  | "greater_than"
  | "less_than"
  | "exists";

export type PrimitiveFieldValue = string | number | boolean | null | undefined;
export type FieldValue =
  | PrimitiveFieldValue
  | string[]
  | number[]
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

export interface SingleFieldCondition {
  field: string;
  operator: ConditionOperator;
  value?: FieldValue;
}

export interface CompoundFieldCondition {
  all?: FieldCondition[];
  any?: FieldCondition[];
}

export type FieldCondition = SingleFieldCondition | CompoundFieldCondition;

export interface FieldOption {
  label: string;
  value: string;
  description?: string;
  icon?: string;
  badge?: string;
}

export interface ValidationRules {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customErrorMessage?: string;
}

export interface FieldConfig {
  id: string;
  name: string;
  label: string;
  description?: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: FieldValue;
  options?: FieldOption[];
  validation?: ValidationRules;
  visibleWhen?: FieldCondition;
  disabledWhen?: FieldCondition;
  fields?: FieldConfig[]; // For group & repeatable_group
  minItems?: number;
  maxItems?: number;
}

export interface CategorySectionConfig {
  id: string;
  title: string;
  description?: string;
  visibleWhen?: FieldCondition;
  fields: FieldConfig[];
}

export interface DocumentRequirement {
  id: string;
  label: string;
  description: string;
  required: boolean;
  acceptedMimeTypes?: string[];
}

export interface CategoryConfig {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  sections: CategorySectionConfig[];
  documentRequirements: DocumentRequirement[];
}
