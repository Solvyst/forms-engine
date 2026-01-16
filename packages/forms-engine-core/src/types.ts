export type CoreFieldType = "text" | "username" | "select" | "url" | "timezone";
export type FieldType = CoreFieldType | `${string}.${string}`;

export type RequiredIf =
  | { eq: { field: string; value: unknown } }
  | { in: { field: string; values: unknown[] } };

export type SelectOption = { label: string; value: string };

export type FormField = {
  id: string;
  key: string;
  type: FieldType;
  label: string;

  dependsOn?: string[];

  required?: boolean;
  requiredIf?: RequiredIf;

  placeholder?: string;
  helpText?: string;

  minLength?: number;
  maxLength?: number;

  options?: SelectOption[];
  defaultValue?: unknown;

  publicPreview?: string;
};

export type FormSchema = {
  schemaId: string;
  schemaVersion: number;
  step: string;
  title: string;
  description?: string;
  fields: FormField[];
};

export type FieldError = {
  key: string;
  code: string;
  message: string;
};
