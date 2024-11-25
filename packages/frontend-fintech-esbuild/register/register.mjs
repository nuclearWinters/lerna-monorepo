import * as nodeModule from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);

export function register() {
  if (nodeModule.register) {
    const hookUrl = new URL("hook.mjs", pathToFileURL(__filename));
    nodeModule.register(hookUrl);
  }
}