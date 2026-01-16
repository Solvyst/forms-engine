import type { FieldType, FormField, RequiredIf, SelectOption } from "./types";

function base(
  id: string,
  key: string,
  label: string,
  type: FieldType
): FormField {
  return { id, key, label, type };
}

export const f = {
  text(id: string, key: string, label: string) {
    return chain(base(id, key, label, "text"));
  },
  username(id: string, key: string, label: string) {
    return chain(base(id, key, label, "username"));
  },
  url(id: string, key: string, label: string) {
    return chain(base(id, key, label, "url"));
  },
  timezone(id: string, key: string, label: string) {
    return chain(base(id, key, label, "timezone"));
  },
  select(id: string, key: string, label: string, options: SelectOption[]) {
    const field = base(id, key, label, "select");
    field.options = options;
    return chain(field);
  },
};

function chain(field: FormField) {
  return {
    dependsOn(keys: string[]) {
      field.dependsOn = keys;
      return this;
    },
    required() {
      field.required = true;
      return this;
    },
    requiredIf(cond: RequiredIf) {
      field.requiredIf = cond;
      return this;
    },
    placeholder(v: string) {
      field.placeholder = v;
      return this;
    },
    help(v: string) {
      field.helpText = v;
      return this;
    },
    min(n: number) {
      field.minLength = n;
      return this;
    },
    max(n: number) {
      field.maxLength = n;
      return this;
    },
    default(v: unknown) {
      field.defaultValue = v;
      return this;
    },
    preview(v: string) {
      field.publicPreview = v;
      return this;
    },
    build(): FormField {
      return field;
    },
  };
}
