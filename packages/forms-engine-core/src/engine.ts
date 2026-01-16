import type { FieldError, FormSchema } from "./types";
import { buildDefaults } from "./defaults";
import { validateAgainstSchema } from "./validate";

export type EngineGetSchemaArgs = { step: string; flow: string; ctx?: any };
export type EngineValidateArgs = EngineGetSchemaArgs & {
  values: Record<string, any>;
};

export type FormsEngine = {
  getSchema(args: EngineGetSchemaArgs): Promise<FormSchema>;
  getDefaults(args: EngineGetSchemaArgs): Promise<Record<string, unknown>>;
  validate(
    args: EngineValidateArgs
  ): Promise<{ ok: true } | { ok: false; errors: FieldError[] }>;
};

export function createFormsEngine(args: {
  getSchema: (p: {
    step: string;
    flow: string;
    ctx?: any;
  }) => Promise<FormSchema | null> | FormSchema | null;
}): FormsEngine {
  return {
    async getSchema({ step, flow, ctx }) {
      const s = await args.getSchema({ step, flow, ctx });
      if (!s) throw new Error(`Schema not found for step=${step} flow=${flow}`);
      return s;
    },

    async getDefaults({ step, flow, ctx }) {
      const schema = await this.getSchema({ step, flow, ctx });
      return buildDefaults(schema);
    },

    async validate({ step, flow, ctx, values }) {
      const schema = await this.getSchema({ step, flow, ctx });
      const errors = validateAgainstSchema(schema, values);
      if (errors.length) return { ok: false, errors };
      return { ok: true };
    },
  };
}
