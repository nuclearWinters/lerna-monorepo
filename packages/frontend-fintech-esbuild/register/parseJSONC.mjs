import { parse } from "jsonc-parser";

export function parseJSONC(source) {
  const errors = [];
  const result = parse(source, errors);
  if (errors.length > 0) {
    throw new Error("Parse error", {
      cause: new AggregateError(errors),
    });
  }
  return result;
}