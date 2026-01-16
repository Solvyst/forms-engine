import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import type { FormsEngine } from "@solvyst/forms-engine-core";
import type { FormsExpressAdapterOptions } from "./types";
import { createFormsEngineHandlers } from "./handlers";

export function createFormsRouter(
  engine: FormsEngine,
  opts: FormsExpressAdapterOptions = {}
): ExpressRouter {
  const router = Router();

  const basePath = opts.basePath ?? "/forms";
  const mode = opts.routeMode ?? "both";

  const h = createFormsEngineHandlers(engine, opts);

  if (mode === "params" || mode === "both") {
    router.get(`${basePath}/:step/schema`, h.getSchemaHandler);
    router.get(`${basePath}/:step/defaults`, h.defaultsHandler);
    router.post(`${basePath}/:step/validate`, h.validateHandler);
  }

  if (mode === "query" || mode === "both") {
    router.get(`${basePath}/schema`, h.getSchemaHandler);
    router.get(`${basePath}/defaults`, h.defaultsHandler);
    router.post(`${basePath}/validate`, h.validateHandler);
  }

  return router;
}
