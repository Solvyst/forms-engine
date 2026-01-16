import type { Request, Response } from "express";
import type { FormsEngine } from "@solvyst/forms-engine-core";
import { defaultReadFlow, defaultReadStep } from "./readers";
import type { FormsExpressAdapterOptions, FormsHandlers } from "./types";

function defaultSuccess(
  res: Response,
  args: { data: unknown; message?: string }
) {
  res.json({ success: true, message: args.message, data: args.data });
}

function defaultError(
  res: Response,
  args: { error: unknown; status?: number }
) {
  const status = args.status ?? 400;
  const msg =
    args.error instanceof Error
      ? args.error.message
      : typeof args.error === "string"
      ? args.error
      : "Request failed";
  res.status(status).json({ success: false, error: msg });
}

export function createFormsEngineHandlers(
  engine: FormsEngine,
  opts: FormsExpressAdapterOptions = {}
): FormsHandlers {
  const buildCtx = opts.buildCtx ?? (() => undefined);
  const readStep = opts.readStep ?? defaultReadStep;
  const readFlow = opts.readFlow ?? defaultReadFlow;

  const onSuccess = opts.onSuccess ?? defaultSuccess;
  const onError = opts.onError ?? defaultError;

  async function resolveSchema(req: Request) {
    const ctx = buildCtx(req);
    const step = readStep(req);
    const flow = readFlow(req);

    const schema = await engine.getSchema({ step, flow, ctx });
    return { ctx, step, flow, schema };
  }

  const getSchemaHandler = async (req: Request, res: Response) => {
    try {
      const { schema } = await resolveSchema(req);
      onSuccess(res, { data: schema, message: "Form schema fetched" });
    } catch (e) {
      onError(res, { error: e, status: 404 });
    }
  };

  const defaultsHandler = async (req: Request, res: Response) => {
    try {
      const { step, flow, ctx } = await resolveSchema(req);
      const defaults = await engine.getDefaults({ step, flow, ctx });
      onSuccess(res, { data: { defaults }, message: "Defaults fetched" });
    } catch (e) {
      onError(res, { error: e, status: 404 });
    }
  };

  const validateHandler = async (req: Request, res: Response) => {
    try {
      const { step, flow, ctx } = await resolveSchema(req);

      const values = (req.body?.values ?? {}) as Record<string, any>;
      if (typeof values !== "object" || values === null) {
        onError(res, {
          error: new Error("Invalid payload: values must be an object"),
          status: 400,
        });
        return;
      }

      const result = await engine.validate({ step, flow, ctx, values });
      if (result.ok === false) {
        onError(res, {
          error: { code: "VALIDATION_FAILED", errors: result.errors },
          status: 400,
        });
        return;
      }

      onSuccess(res, { data: { ok: true }, message: "Valid" });
    } catch (e) {
      onError(res, { error: e, status: 400 });
    }
  };

  return { getSchemaHandler, defaultsHandler, validateHandler };
}
