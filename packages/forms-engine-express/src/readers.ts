import type { Request } from "express";

function normalizeStep(v: string) {
  return String(v ?? "")
    .trim()
    .toUpperCase();
}

export function defaultReadStep(req: Request): string {
  const fromParam = normalizeStep(String((req.params as any)?.step ?? ""));
  if (fromParam) return fromParam;

  const fromQuery = normalizeStep(String((req.query as any)?.step ?? ""));
  if (fromQuery) return fromQuery;

  throw new Error("Missing step");
}

export function defaultReadFlow(req: Request): string {
  const flow = String((req.query as any)?.flow ?? "default")
    .trim()
    .toLowerCase();
  return flow || "default";
}
