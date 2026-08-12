import {
  FieldCondition,
  SingleFieldCondition,
  CompoundFieldCondition,
  FieldValue,
  FieldConfig,
  CategorySectionConfig,
} from "./types";

/**
 * Safely get a nested value from an object using dot notation path (e.g. "rooms.0.type" or "categoryData.roomTypes")
 */
export function getNestedValue(obj: Record<string, unknown> | null | undefined, path: string): FieldValue {
  if (!obj || typeof obj !== "object" || !path) return undefined;

  const resolve = (targetObj: Record<string, unknown>, targetPath: string): unknown => {
    const parts = targetPath.split(".");
    let current: unknown = targetObj;

    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== "object") {
        return undefined;
      }
      current = (current as Record<string, unknown>)[part];
    }
    return current;
  };

  // Direct lookup
  let val = resolve(obj, path);
  if (val !== undefined) return val as FieldValue;

  // If path starts with categoryData. and obj is already the categoryData object
  if (path.startsWith("categoryData.")) {
    const strippedPath = path.substring("categoryData.".length);
    val = resolve(obj, strippedPath);
    if (val !== undefined) return val as FieldValue;
  }

  // If path does not start with categoryData. but obj has categoryData
  if (!path.startsWith("categoryData.") && typeof obj.categoryData === "object" && obj.categoryData !== null) {
    val = resolve(obj.categoryData as Record<string, unknown>, path);
    if (val !== undefined) return val as FieldValue;
  }

  return undefined;
}


/**
 * Evaluate a single condition against current form values
 */
function evaluateSingleCondition(
  condition: SingleFieldCondition,
  formValues: Record<string, unknown>
): boolean {
  const { field, operator, value: targetValue } = condition;
  const actualValue = getNestedValue(formValues, field);

  switch (operator) {
    case "equals":
      return actualValue === targetValue;

    case "not_equals":
      return actualValue !== targetValue;

    case "includes":
      if (Array.isArray(actualValue)) {
        return actualValue.includes(targetValue as never);
      }
      if (typeof actualValue === "string" && typeof targetValue === "string") {
        return actualValue.toLowerCase().includes(targetValue.toLowerCase());
      }
      return false;

    case "not_includes":
      if (Array.isArray(actualValue)) {
        return !actualValue.includes(targetValue as never);
      }
      if (typeof actualValue === "string" && typeof targetValue === "string") {
        return !actualValue.toLowerCase().includes(targetValue.toLowerCase());
      }
      return true;

    case "is_true":
      return actualValue === true || actualValue === "true";

    case "is_false":
      return actualValue === false || actualValue === "false" || actualValue === null || actualValue === undefined || actualValue === "";

    case "greater_than": {
      const numActual = typeof actualValue === "number" ? actualValue : Number(actualValue);
      const numTarget = typeof targetValue === "number" ? targetValue : Number(targetValue);
      return !isNaN(numActual) && !isNaN(numTarget) && numActual > numTarget;
    }

    case "less_than": {
      const numActual = typeof actualValue === "number" ? actualValue : Number(actualValue);
      const numTarget = typeof targetValue === "number" ? targetValue : Number(targetValue);
      return !isNaN(numActual) && !isNaN(numTarget) && numActual < numTarget;
    }

    case "exists":
      return actualValue !== undefined && actualValue !== null && actualValue !== "" && (!Array.isArray(actualValue) || actualValue.length > 0);

    default:
      return true;
  }
}

/**
 * Evaluate any FieldCondition (single or compound all/any)
 */
export function evaluateCondition(
  condition: FieldCondition | undefined | null,
  formValues: Record<string, unknown>
): boolean {
  if (!condition) return true;

  // Check if compound condition with 'all'
  if ("all" in condition && Array.isArray((condition as CompoundFieldCondition).all)) {
    const conditions = (condition as CompoundFieldCondition).all!;
    if (conditions.length === 0) return true;
    return conditions.every((c) => evaluateCondition(c, formValues));
  }

  // Check if compound condition with 'any'
  if ("any" in condition && Array.isArray((condition as CompoundFieldCondition).any)) {
    const conditions = (condition as CompoundFieldCondition).any!;
    if (conditions.length === 0) return true;
    return conditions.some((c) => evaluateCondition(c, formValues));
  }

  // Single condition
  if ("field" in condition && "operator" in condition) {
    return evaluateSingleCondition(condition as SingleFieldCondition, formValues);
  }

  return true;
}

/**
 * Determine if a field is currently visible based on its visibleWhen condition
 */
export function isFieldVisible(
  field: FieldConfig,
  formValues: Record<string, unknown>
): boolean {
  if (!field.visibleWhen) return true;
  return evaluateCondition(field.visibleWhen, formValues);
}

/**
 * Determine if a field is currently disabled based on its disabledWhen condition
 */
export function isFieldDisabled(
  field: FieldConfig,
  formValues: Record<string, unknown>
): boolean {
  if (!field.disabledWhen) return false;
  return evaluateCondition(field.disabledWhen, formValues);
}

/**
 * Determine if a section is currently visible based on its visibleWhen condition
 */
export function isSectionVisible(
  section: CategorySectionConfig,
  formValues: Record<string, unknown>
): boolean {
  if (!section.visibleWhen) return true;
  return evaluateCondition(section.visibleWhen, formValues);
}
