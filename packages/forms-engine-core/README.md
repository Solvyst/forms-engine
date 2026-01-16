# @solvyst/forms-engine-core

A **framework-agnostic, server-driven forms engine** for building dynamic forms using schemas defined on the server.

This package provides the **core logic only**:

- form schema definition
- conditional rules
- default value generation
- server-side validation
- flow + step based resolution

It does **not** depend on Express, React, or any UI framework.

---

## What this is

- A **forms engine**, not a UI renderer
- A **server-driven** contract for forms
- A reusable **core primitive** for SaaS platforms
- Safe to use in monoliths or microservices

---

## What this is NOT

- ❌ Not a React form library
- ❌ Not a replacement for Zod / Yup
- ❌ Not an HTTP router
- ❌ Not a database layer

This library intentionally stays small and focused.

---

## Installation

```bash
pnpm add @solvyst/forms-engine-core
# or
npm install @solvyst/forms-engine-core
```
