# @solvyst/forms-engine-express

Express adapter for [`@solvyst/forms-engine-core`](../forms-engine-core).

This package provides:

- Express router factory for server-driven forms
- Optional handler factory (if you want to mount routes yourself)
- Step + flow based schema resolution
- Hook-based response formatting (so you can plug in your own `ApiResponse` / error format)

> This is an adapter. All business logic (schemas, validation rules, defaults) lives in `@solvyst/forms-engine-core`.

---

## What this is

- A thin Express integration layer for server-driven forms
- A clean, reusable router with configurable response hooks
- Supports both route styles:
  - Preferred: `/forms/:step/...` (step in path)
  - Legacy: `/forms/... ?step=...` (step in query)

---

## What this is NOT

- Not a form UI renderer (React/Vue)
- Not a schema database layer
- Not a validation library replacement (Zod/Yup)
- Not coupled to any app-specific `ApiResponse` / `AppError`

---

## Installation

```bash
pnpm add @solvyst/forms-engine-express @solvyst/forms-engine-core
pnpm add express
```

> `express` is a peer dependency.

---

## Endpoints

By default, the router registers both styles:

### Preferred (step in path)

- `GET  /forms/:step/schema?flow=setup`
- `GET  /forms/:step/defaults?flow=setup`
- `POST /forms/:step/validate?flow=setup`

### Legacy (step in query)

- `GET  /forms/schema?step=PROVIDER&flow=setup`
- `GET  /forms/defaults?step=PROVIDER&flow=setup`
- `POST /forms/validate?step=PROVIDER&flow=setup`

### Validate payload

`POST .../validate` expects:

```json
{
  "values": {
    "displayName": "Anil Moharana",
    "meetingMode": "EXTERNAL"
  }
}
```

---

## Quick Start

### 1) Create a core engine

```ts
import { createFormsEngine } from "@solvyst/forms-engine-core";

export const engine = createFormsEngine({
  getSchema: async ({ step, flow, ctx }) => {
    if (step === "PROVIDER" && flow === "setup") return providerSetupSchema;
    return null;
  },
});
```

### 2) Mount Express router

```ts
import express from "express";
import { createFormsRouter } from "@solvyst/forms-engine-express";
import { engine } from "./engine";

const app = express();
app.use(express.json());

app.use(
  createFormsRouter(engine, {
    buildCtx: (req) => ({ userId: req.headers["x-user-id"] }),
  })
);

app.listen(4000);
```

---

## Custom Response Format (recommended)

Most apps already have a response wrapper. Use hooks to integrate without coupling.

```ts
import { createFormsRouter } from "@solvyst/forms-engine-express";
import { engine } from "./engine";

app.use(
  createFormsRouter(engine, {
    buildCtx: (req) => req.ctx, // your app context

    onSuccess: (res, { data, message }) => {
      res.json({ ok: true, message, data });
    },

    onError: (res, { error, status }) => {
      // handle validation errors or not-found errors your way
      res.status(status ?? 400).json({
        ok: false,
        error:
          typeof error === "string"
            ? error
            : (error as any)?.message ?? "Request failed",
      });
    },
  })
);
```

---

## Route Mode (params/query/both)

You can choose which routes to expose:

```ts
createFormsRouter(engine, { routeMode: "params" }); // only /forms/:step/...
createFormsRouter(engine, { routeMode: "query" }); // only /forms/... ?step=
createFormsRouter(engine, { routeMode: "both" }); // default
```

---

## Mount Path / Base Path

The router internally uses a base path (default: `/forms`).
You can override it:

```ts
createFormsRouter(engine, { basePath: "/form-engine" });
```

If you mount the router at `/api`, final routes become:

- `/api/forms/:step/schema`
- `/api/forms/:step/defaults`
- `/api/forms/:step/validate`

---

## How step/flow are read

### Defaults

- `step`: prefers `req.params.step`, falls back to `req.query.step`
- `flow`: uses `req.query.flow` (default: `"default"`)

### Override readers

```ts
createFormsRouter(engine, {
  readStep: (req) =>
    String(req.params.step ?? req.query.step ?? "").toUpperCase(),
  readFlow: (req) => String(req.query.flow ?? "default").toLowerCase(),
});
```

---

## Using handlers directly

If you want to build your own router, you can use the handler factory:

```ts
import { Router } from "express";
import { createFormsEngineHandlers } from "@solvyst/forms-engine-express";

const h = createFormsEngineHandlers(engine, { buildCtx: (req) => req.ctx });

const router = Router();
router.get("/forms/:step/schema", h.getSchemaHandler);
router.get("/forms/:step/defaults", h.defaultsHandler);
router.post("/forms/:step/validate", h.validateHandler);
```

---

## Error behavior

- Unknown schema step -> defaults to 404 in adapter
- Invalid payload (`values` not object) -> 400
- Validation failures -> 400 with payload shaped by `onError`

> For strict domain validation (e.g., uniqueness checks), implement them in your `getSchema` / service layer and throw errors mapped by `onError`.

---

## License

MIT © Anil Moharana
