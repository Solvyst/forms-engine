import type { FieldError, FormField, FormSchema } from "./types";
import { evalCondition } from "./conditions";

function isEmpty(v: any) {
  return (
    v === undefined || v === null || (typeof v === "string" && v.trim() === "")
  );
}

function isApplicable(field: FormField, values: Record<string, any>) {
  if (field.requiredIf && !evalCondition(field.requiredIf, values))
    return false;
  return true;
}

function isRequired(field: FormField, values: Record<string, any>) {
  if (field.required) return true;
  if (field.requiredIf) return evalCondition(field.requiredIf, values);
  return false;
}

function err(key: string, code: string, message: string): FieldError {
  return { key, code, message };
}

export function validateAgainstSchema(
  schema: FormSchema,
  values: Record<string, any>
): FieldError[] {
  const errors: FieldError[] = [];

  for (const field of schema.fields) {
    if (!isApplicable(field, values)) continue;

    const v = values[field.key];

    if (isRequired(field, values) && isEmpty(v)) {
      errors.push(err(field.key, "required", `${field.label} is required`));
      continue;
    }

    if (isEmpty(v)) continue;

    if (typeof v === "string") {
      if (field.minLength !== undefined && v.length < field.minLength) {
        errors.push(
          err(
            field.key,
            "min_length",
            `${field.label} must be at least ${field.minLength} characters`
          )
        );
      }
      if (field.maxLength !== undefined && v.length > field.maxLength) {
        errors.push(
          err(
            field.key,
            "max_length",
            `${field.label} must be at most ${field.maxLength} characters`
          )
        );
      }
    }

    if (field.type === "select" && field.options?.length) {
      const allowed = new Set(field.options.map((o) => o.value));
      if (!allowed.has(String(v))) {
        errors.push(
          err(field.key, "invalid_option", `${field.label} has invalid value`)
        );
      }
    }
  }

  return errors;
}
