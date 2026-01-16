# @solvyst/forms-engine-core

Framework-agnostic, server-driven forms engine for schema definition, defaults, and validation.

This package provides the core logic only:
- Schema structure for fields and steps
- Conditional required rules
- Default value generation
- Server-side validation
- Step + flow based schema resolution (via your engine)

> No HTTP, no UI, no database. This is the core primitive.

---

## What this is

- A forms engine, not a UI renderer
- A server-driven contract for dynamic forms
- A reusable core for monoliths or microservices
- Safe to integrate with any transport layer

---

## What this is NOT

- Not a React/Vue form library
- Not a replacement for Zod/Yup
- Not an HTTP router
- Not a database layer

---

## Installation

```bash
pnpm add @solvyst/forms-engine-core
# or
npm install @solvyst/forms-engine-core
```

---

## Quick Start

### 1) Define a schema

```ts
import type { FormSchema } from "@solvyst/forms-engine-core";
import { f } from "@solvyst/forms-engine-core";

export const providerSetupSchema: FormSchema = {
  schemaId: "provider.setup",
  schemaVersion: 1,
  step: "PROVIDER",
  title: "Provider Setup",
  description: "Tell us about your practice",
  fields: [
    f.text("display-name", "displayName", "Display name").required().min(2).build(),
    f.url("website", "website", "Website").build(),
    f.select("mode", "meetingMode", "Meeting mode", [
      { label: "External", value: "EXTERNAL" },
      { label: "In-person", value: "IN_PERSON" }
    ])
      .required()
      .build()
  ]
};
```

### 2) Create an engine

```ts
import { createFormsEngine } from "@solvyst/forms-engine-core";
import { providerSetupSchema } from "./schemas";

export const engine = createFormsEngine({
  getSchema: async ({ step, flow }) => {
    if (step === "PROVIDER" && flow === "setup") return providerSetupSchema;
    return null;
  }
});
```

### 3) Validate values

```ts
const result = await engine.validate({
  step: "PROVIDER",
  flow: "setup",
  values: { displayName: "", meetingMode: "EXTERNAL" }
});

if (!result.ok) {
  console.log(result.errors);
}
```

---

## Schema model

### FormSchema

```ts
type FormSchema = {
  schemaId: string;
  schemaVersion: number;
  step: string;
  title: string;
  description?: string;
  fields: FormField[];
};
```

### FormField

```ts
type FormField = {
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
```

### FieldType

Core types:
- `text`
- `username`
- `select`
- `url`
- `timezone`

Custom types are allowed using `namespace.type` (e.g. `billing.phone`).

---

## Builder helpers

`f` is a small fluent builder for fields:

```ts
import { f } from "@solvyst/forms-engine-core";

const field = f
  .text("display-name", "displayName", "Display name")
  .required()
  .min(2)
  .max(60)
  .help("This appears on your public profile")
  .build();
```

Available builders:
- `f.text`
- `f.username`
- `f.url`
- `f.timezone`
- `f.select` (with options)

Chainable helpers:
- `required`, `requiredIf`, `dependsOn`
- `min`, `max`
- `placeholder`, `help`
- `default`, `preview`
- `build`

---

## Conditional required

Use `requiredIf` to make a field required based on another field's value.

```ts
import { f } from "@solvyst/forms-engine-core";

const field = f
  .text("clinic-name", "clinicName", "Clinic name")
  .requiredIf({ eq: { field: "meetingMode", value: "IN_PERSON" } })
  .build();
```

Supported conditions:
- `eq` (field equals value)
- `in` (field value is in an allowed list)

---

## Defaults

Default values are generated from fields with `defaultValue`.

```ts
const defaults = await engine.getDefaults({ step: "PROVIDER", flow: "setup" });
```

You can also call `buildDefaults(schema)` directly.

---

## Validation

Validation rules include:
- required / requiredIf
- minLength / maxLength
- select option membership

```ts
const errors = validateAgainstSchema(schema, values);
```

Error shape:

```ts
type FieldError = { key: string; code: string; message: string };
```

---

## Engine API

```ts
const engine = createFormsEngine({ getSchema });

engine.getSchema({ step, flow, ctx });
engine.getDefaults({ step, flow, ctx });
engine.validate({ step, flow, ctx, values });
```

`ctx` is forwarded to your `getSchema` implementation so you can fetch tenant-specific schemas.

---

## Integration

This package is transport-agnostic. For Express integration, see:
`@solvyst/forms-engine-express`

---

## License

MIT © Anil Moharana
