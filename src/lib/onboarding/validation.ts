import { z } from "zod";
import { CategoryConfig, FieldConfig, CategorySectionConfig } from "./types";
import { isFieldVisible, isSectionVisible, getNestedValue } from "./conditions";

/**
 * Builds a base Zod type for a specific primitive field definition
 */
function buildFieldZodType(field: FieldConfig): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "text":
    case "textarea":
    case "date":
    case "time": {
      let strSchema = z.string();
      if (field.validation?.minLength) {
        strSchema = strSchema.min(field.validation.minLength, `${field.label} must be at least ${field.validation.minLength} characters`);
      }
      if (field.validation?.maxLength) {
        strSchema = strSchema.max(field.validation.maxLength, `${field.label} cannot exceed ${field.validation.maxLength} characters`);
      }
      if (field.validation?.pattern) {
        strSchema = strSchema.regex(new RegExp(field.validation.pattern), field.validation.customErrorMessage || `${field.label} is invalid`);
      }
      schema = strSchema;
      break;
    }

    case "number":
    case "currency": {
      let numSchema = z.coerce.number();
      if (field.validation?.min !== undefined) {
        numSchema = numSchema.min(field.validation.min, `${field.label} must be at least ${field.validation.min}`);
      }
      if (field.validation?.max !== undefined) {
        numSchema = numSchema.max(field.validation.max, `${field.label} cannot exceed ${field.validation.max}`);
      }
      schema = numSchema;
      break;
    }

    case "switch":
    case "checkbox": {
      schema = z.boolean();
      break;
    }

    case "select":
    case "radio": {
      if (field.options && field.options.length > 0) {
        const allowedValues = field.options.map((o) => o.value) as [string, ...string[]];
        schema = z.enum(allowedValues);
      } else {
        schema = z.string();
      }
      break;
    }

    case "multi_select":
    case "checkbox_group": {
      if (field.options && field.options.length > 0) {
        const allowedValues = field.options.map((o) => o.value) as [string, ...string[]];
        schema = z.array(z.enum(allowedValues));
      } else {
        schema = z.array(z.string());
      }
      break;
    }

    case "image":
    case "file": {
      schema = z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        storagePath: z.string().optional(),
        fileName: z.string().optional(),
        mimeType: z.string().optional(),
      }).or(z.string().url());
      break;
    }

    case "group": {
      if (field.fields && field.fields.length > 0) {
        const shape: Record<string, z.ZodTypeAny> = {};
        for (const subField of field.fields) {
          shape[subField.name] = buildFieldZodType(subField).optional().nullable();
        }
        schema = z.object(shape);
      } else {
        schema = z.record(z.string(), z.unknown());
      }
      break;
    }

    case "repeatable_group": {
      if (field.fields && field.fields.length > 0) {
        const itemShape: Record<string, z.ZodTypeAny> = {};
        for (const subField of field.fields) {
          itemShape[subField.name] = buildFieldZodType(subField).optional().nullable();
        }
        let arraySchema = z.array(z.object(itemShape));
        if (field.minItems) {
          arraySchema = arraySchema.min(field.minItems, `At least ${field.minItems} ${field.label} required`);
        }
        if (field.maxItems) {
          arraySchema = arraySchema.max(field.maxItems, `Cannot exceed ${field.maxItems} ${field.label}`);
        }
        schema = arraySchema;
      } else {
        schema = z.array(z.record(z.string(), z.unknown()));
      }
      break;
    }

    default:
      schema = z.unknown();
  }

  return schema;
}

/**
 * Validates a single field against current form values and visibility
 */
function validateFieldInstance(
  field: FieldConfig,
  parentValues: Record<string, unknown>,
  rootValues: Record<string, unknown>,
  pathPrefix: string,
  errors: Array<{ path: string; message: string }>
): void {
  const isVisible = isFieldVisible(field, rootValues);
  if (!isVisible) {
    // Hidden fields are skipped from required validation
    return;
  }

  const rawValue = parentValues[field.name];
  const fieldPath = pathPrefix ? `${pathPrefix}.${field.name}` : field.name;

  // Check required constraint
  if (field.required) {
    const isEmpty =
      rawValue === undefined ||
      rawValue === null ||
      rawValue === "" ||
      (Array.isArray(rawValue) && rawValue.length === 0) ||
      (typeof rawValue === "object" && Object.keys(rawValue as object).length === 0);

    if (isEmpty) {
      errors.push({
        path: fieldPath,
        message: `${field.label} is required`,
      });
      return;
    }
  }

  // If value is provided, validate according to field type
  if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
    if (field.type === "group" && field.fields && typeof rawValue === "object" && !Array.isArray(rawValue)) {
      for (const childField of field.fields) {
        validateFieldInstance(
          childField,
          rawValue as Record<string, unknown>,
          rootValues,
          fieldPath,
          errors
        );
      }
    } else if (field.type === "repeatable_group" && field.fields && Array.isArray(rawValue)) {
      if (field.minItems && rawValue.length < field.minItems) {
        errors.push({
          path: fieldPath,
          message: `At least ${field.minItems} items required`,
        });
      }
      rawValue.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          for (const childField of field.fields!) {
            validateFieldInstance(
              childField,
              item as Record<string, unknown>,
              rootValues,
              `${fieldPath}.${index}`,
              errors
            );
          }
        }
      });
    } else {
      // Validate primitive type with Zod
      const zodType = buildFieldZodType(field);
      const parseResult = zodType.safeParse(rawValue);
      if (!parseResult.success) {
        errors.push({
          path: fieldPath,
          message: parseResult.error.issues[0]?.message || `Invalid ${field.label}`,
        });
      }
    }
  }
}

/**
 * Validates a category section and all its visible fields
 */
function validateSectionInstance(
  section: CategorySectionConfig,
  rootValues: Record<string, unknown>,
  errors: Array<{ path: string; message: string }>
): void {
  if (!isSectionVisible(section, rootValues)) {
    return;
  }

  for (const field of section.fields) {
    validateFieldInstance(field, rootValues, rootValues, "", errors);
  }
}

/**
 * Creates an authoritative Zod schema for a CategoryConfig with conditional refinement
 */
export function createCategoryZodSchema(config: CategoryConfig): z.ZodType<Record<string, unknown>> {
  return z.record(z.string(), z.unknown()).superRefine((data, ctx) => {
    const errors: Array<{ path: string; message: string }> = [];

    for (const section of config.sections) {
      validateSectionInstance(section, data, errors);
    }

    for (const err of errors) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: err.path.split("."),
        message: err.message,
      });
    }
  });
}

/**
 * Cleans category data by removing values from hidden fields/sections
 */
export function sanitizeCategoryData(
  config: CategoryConfig,
  rawData: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const section of config.sections) {
    if (!isSectionVisible(section, rawData)) {
      continue;
    }

    for (const field of section.fields) {
      if (!isFieldVisible(field, rawData)) {
        continue;
      }

      const val = rawData[field.name];
      if (val !== undefined) {
        if (field.type === "group" && field.fields && typeof val === "object" && val !== null) {
          const groupSanitized: Record<string, unknown> = {};
          for (const sub of field.fields) {
            if (isFieldVisible(sub, rawData)) {
              const subVal = (val as Record<string, unknown>)[sub.name];
              if (subVal !== undefined) groupSanitized[sub.name] = subVal;
            }
          }
          sanitized[field.name] = groupSanitized;
        } else {
          sanitized[field.name] = val;
        }
      }
    }
  }

  return sanitized;
}

/**
 * Authoritative server-side validation function for category submissions
 */
export function validateCategorySubmission(
  config: CategoryConfig,
  rawData: Record<string, unknown>
): { success: true; data: Record<string, unknown> } | { success: false; error: string; issues: Array<{ path: string; message: string }> } {
  const schema = createCategoryZodSchema(config);
  const result = schema.safeParse(rawData);

  if (!result.success) {
    const issues = result.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return {
      success: false,
      error: issues[0]?.message || "Category validation failed.",
      issues,
    };
  }

  const sanitized = sanitizeCategoryData(config, result.data);
  return {
    success: true,
    data: sanitized,
  };
}
