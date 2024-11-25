import { readFile } from "node:fs/promises";
import { parentDir } from "./util.mjs";

export async function loadTsConfig(
  targetUrl
) {
  return loadConfig(targetUrl, "tsconfig.json");
}

async function loadConfig(
  targetUrl,
  fileName
) {
  if (targetUrl.protocol === "data:") {
    return undefined;
  }
  while (true) {
    try {
      const loadUrl = new URL(fileName, targetUrl);
      const content = await readFile(loadUrl, { encoding: "utf-8" });
      return {
        url: loadUrl.toString(),
        content,
      };
    } catch (e) {
      if (
        e !== null &&
        typeof e === "object" &&
        "code" in e &&
        e.code === "ENOENT"
      ) {
        const parent = parentDir(targetUrl);
        if (parent.toString() === targetUrl.toString()) {
          return undefined;
        }
        targetUrl = parent;
      } else {
        throw e;
      }
    }
  }
}