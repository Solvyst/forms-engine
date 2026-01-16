import type { Request, Response, RequestHandler } from "express";

export type FormsRouteMode = "params" | "query" | "both";

export type FormsExpressAdapterOptions = {
  buildCtx?: (req: Request) => unknown;
  readStep?: (req: Request) => string;
  readFlow?: (req: Request) => string;

  onSuccess?: (
    res: Response,
    args: { data: unknown; message?: string }
  ) => void;

  onError?: (res: Response, args: { error: unknown; status?: number }) => void;

  routeMode?: FormsRouteMode;
  basePath?: string;
};

export type FormsHandlers = {
  getSchemaHandler: RequestHandler;
  defaultsHandler: RequestHandler;
  validateHandler: RequestHandler;
};
