import { access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import {
  loadTsConfig,
} from "./tsconfig.mjs";
import { existsSync } from "node:fs";
import { resolvePaths } from "./paths.mjs";
import { parseJSONC } from "./parseJSONC.mjs";

const tsExtensions = /\.(?:[cm]?ts|tsx)$/;

export async function resolveModule(
  specifier,
  parentURL
) {
  if (specifier.startsWith("node:") || specifier.startsWith("data:")) {
    return undefined;
  }
  parentURL ??= pathToFileURL(
    path.join(process.cwd(), "__entrypoint__")
  ).toString();
  let candidates;
  const tsConfig = await loadTsConfig(new URL(parentURL));
  if (tsConfig !== undefined) {
    const { url: tsConfigUrl, content } = tsConfig;
    const { baseUrl, paths } = parseJSONC(content)?.compilerOptions ?? {};
    if (paths !== undefined) {
      const resolved = resolvePaths(specifier, paths);
      if (resolved !== undefined) {
        candidates = resolved.map((resolved) => {
          return {
            specifier: resolved,
            parentURL: pathToFileURL(
              path.resolve(
                fileURLToPath(tsConfigUrl),
                "..",
                baseUrl ?? "./__entrypoint__"
              )
            ).toString(),
          };
        });
      }
    }
  }

  try {
    candidates ??= [
      {
        specifier,
        parentURL,
      },
    ];
    for (const { specifier, parentURL } of candidates) {
      if (isExternalSpecifier(specifier)) {
        continue;
      }
      const url = new URL(specifier, parentURL);
      const tsUrl = await mapJsToTs(url);

      if (tsUrl !== undefined) {
        return tsUrl.toString();
      }
      if (tsExtensions.test(url.pathname)) {
        await access(url);
        return url.toString();
      }
      for (const ext of [".ts", ".tsx", ".cts", ".mts"]) {
        const tsUrl = new URL(url.pathname + ext, url);
        const exists = await access(tsUrl)
          .then(() => true)
          .catch(() => false);
        if (exists) {
          return tsUrl.toString();
        }
      }
    }
  } catch {}
  return undefined;
}

export function rawSourceToText(
  source
) {
  if (typeof source === "string") {
    return source;
  }
  if (source instanceof ArrayBuffer) {
    return Buffer.from(source).toString("utf8");
  }
  return Buffer.from(
    source.buffer,
    source.byteOffset,
    source.byteLength
  ).toString("utf8");
}

const jsExtensions = /\.([cm]?js|jsx)$/;
const jsToTs = {
  js: ["ts", "tsx"],
  jsx: ["tsx"],
  cjs: ["cts"],
  mjs: ["mts"],
};

export async function mapJsToTs(url) {
  const m = jsExtensions.exec(url.pathname);
  if (m !== null) {
    const matchedExt = m[1];
    const tsExts = jsToTs[matchedExt];
    for (const ext of tsExts) {
      const tsUrl = new URL(
        url.pathname.slice(0, -matchedExt.length) + ext,
        url
      );
      const exists = await access(tsUrl)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        return tsUrl;
      }
    }
  }
  return undefined;
}

export function mapJsToTsSync(url) {
  const m = jsExtensions.exec(url.pathname);
  if (m !== null) {
    const matchedExt = m[1];
    const tsExts = jsToTs[matchedExt];
    for (const ext of tsExts) {
      const tsUrl = new URL(
        url.pathname.slice(0, -matchedExt.length) + ext,
        url
      );
      if (existsSync(tsUrl)) {
        return tsUrl;
      }
    }
  }
  return undefined;
}

function isExternalSpecifier(specifier) {
  // has protocol
  if (/^[a-zA-Z]+:/.test(specifier)) {
    return false;
  }
  // relative path
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    return false;
  }
  return true;
}