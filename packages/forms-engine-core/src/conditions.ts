import type { RequiredIf } from "./types";
import { getByDot } from "./path";

export function evalCondition(
  cond: RequiredIf | undefined,
  values: Record<string, any>
): boolean {
  if (!cond) return true;

  if ("eq" in cond) {
    const { field, value } = cond.eq;
    return getByDot(values, field) === value;
  }

  if ("in" in cond) {
    const { field, values: allowed } = cond.in;
    return allowed.includes(getByDot(values, field));
  }

  return true;
}
