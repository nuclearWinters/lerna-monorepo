import { transform } from "esbuild";
import { loadTsConfig } from "./tsconfig.mjs";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  rawSourceToText,
  resolveModule,
} from "./core.mjs";
import { transformAsync } from "@babel/core"
import { transform as SVGTransform } from '@svgr/core'

const tsExtensions = /\.(?:[cm]?ts|tsx)$/;
const svgExtensions = /\.(?:[cm]?svg)$/;

let dataUrlResolutionBaseUrl =
  process.env.DATA_URL_RESOLUTION_BASE &&
  pathToFileURL(process.env.DATA_URL_RESOLUTION_BASE).toString();

let includeNodeModules = !!process.env.INCLUDE_NODE_MODULES;

export const initialize = (data) => {
  if (data?.dataUrlResolutionBase !== undefined) {
    dataUrlResolutionBaseUrl = pathToFileURL(
      data.dataUrlResolutionBase
    ).toString();
  }
  if (data?.includeNodeModules !== undefined) {
    includeNodeModules = data.includeNodeModules;
  }
};

const isNodeModules = (url) => {
  return url.includes("/node_modules/");
};

export const resolve = async (
  specifier,
  context,
  defaultResolve
) => {
  if (
    context.parentURL?.startsWith("data:") &&
    dataUrlResolutionBaseUrl !== undefined
  ) {
    context.parentURL = dataUrlResolutionBaseUrl;
  }
  if (
    !includeNodeModules &&
    context.parentURL !== undefined &&
    isNodeModules(context.parentURL)
  ) {
    const res = await defaultResolve(specifier, context);
    return res;
  }

  const resolved = await resolveModule(specifier, context.parentURL);
  if (resolved === undefined) {
    const res = await defaultResolve(specifier, context);
    return res;
  }
  return {
    shortCircuit: true,
    url: resolved,
  };
};

export const load = async (url, context, nextLoad) => {
  if (url.startsWith("node:") || url.startsWith("data:")) {
    return nextLoad(url, context);
  }
  const tsUrl = tsExtensions.test(url) ? new URL(url) : undefined;
  const svgUrl = svgExtensions.test(url) ? new URL(url) : undefined;
  if (tsUrl !== undefined) {
    const rawSource = await readFile(fileURLToPath(tsUrl), {
      encoding: "utf-8",
    });
    const raw = rawSourceToText(rawSource);
    const tsconfig = await loadTsConfig(tsUrl);
    const babelTranform = await transformAsync(raw, {
      plugins: [
        ["@babel/plugin-syntax-typescript", { isTSX: true }],
        ["babel-plugin-relay"],
        ["@babel/plugin-syntax-jsx"],
        ["@stylexjs/babel-plugin"]
      ],
      code: true,
      filename: url,
    })
    const source = await transform(babelTranform.code, {
      loader: "tsx",
      tsconfigRaw: tsconfig?.content,
      format: "cjs",
    });
    return {
      shortCircuit: true,
      format: "commonjs",
      source: source.code.replaceAll(".graphql", ".graphql.ts"),
    };
  } else if (svgUrl !== undefined) {
    const rawSource = await readFile(fileURLToPath(svgUrl), {
      encoding: "utf-8",
    });
    const raw = rawSourceToText(rawSource);
    const jsCode = await SVGTransform(
      raw,
      { icon: true, plugins: ['@svgr/plugin-jsx'] },
      { componentName: 'MyComponent' },
    )
    const source = await transform(jsCode, {
      loader: "jsx",
      format: "cjs",
    });
    return {
      shortCircuit: true,
      format: "commonjs",
      source: source.code,
    };
  }
  const loadResult = await nextLoad(url, context);
  if (loadResult.format === "commonjs") {
    loadResult.source ??= await readFile(
      new URL(loadResult.responseURL ?? url),
      "utf-8"
    );
  }
  return loadResult;

};