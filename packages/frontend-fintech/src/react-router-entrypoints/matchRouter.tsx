import { EntryPointParams } from "../react-router-entrypoints/createRouter";
import { CustomSimpleEntryPoint, EntryPointRoute } from "./createRouter";

const MATCHING_GROUP_REGEXP = /\((?!\?)/g;

function pathtoRegexp(
  path: RegExp | string | RegExp[] | string[],
  keys: {
    name: number;
    optional: boolean;
    offset: number;
  }[],
  options: {
    end: boolean;
    strict: boolean;
    sensitive: boolean;
  }
): RegExp {
  options = options || {};
  keys = keys || [];
  const strict = options.strict;
  const end = options.end !== false;
  const flags = options.sensitive ? "" : "i";
  let extraOffset = 0;
  const keysOffset = keys.length;
  let i = 0;
  let name = 0;
  let m;

  if (path instanceof RegExp) {
    while ((m = MATCHING_GROUP_REGEXP.exec(path.source))) {
      keys.push({
        name: name++,
        optional: false,
        offset: m.index,
      });
    }

    return path;
  }

  if (Array.isArray(path)) {
    // Map array parts into regexps and return their source. We also pass
    // the same keys and options instance into every generation to get
    // consistent matching groups before we join the sources together.
    path = path.map(function (value) {
      return pathtoRegexp(value, keys, options).source;
    });

    return new RegExp("(?:" + path.join("|") + ")", flags);
  }

  path = (
    "^" +
    path +
    (strict ? "" : path[path.length - 1] === "/" ? "?" : "/?")
  )
    .replace(/\/\(/g, "/(?:")
    .replace(/([/.])/g, "\\$1")
    .replace(
      /(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g,
      function (match, slash, format, key, capture, star, optional, offset) {
        slash = slash || "";
        format = format || "";
        capture = capture || "([^\\/" + format + "]+?)";
        optional = optional || "";

        keys.push({
          name: key,
          optional: !!optional,
          offset: offset + extraOffset,
        });

        const result =
          "" +
          (optional ? "" : slash) +
          "(?:" +
          format +
          (optional ? slash : "") +
          capture +
          (star ? "((?:[\\/" + format + "].+?)?)" : "") +
          ")" +
          optional;

        extraOffset += result.length - match.length;

        return result;
      }
    )
    .replace(/\*/g, function (star, index) {
      let len = keys.length;

      while (len-- > keysOffset && keys[len].offset > index) {
        keys[len].offset += 3; // Replacement length minus asterisk length.
      }

      return "(.*)";
    });

  // This is a workaround for handling unnamed matching groups.
  while ((m = MATCHING_GROUP_REGEXP.exec(path))) {
    let escapeCount = 0;
    let index = m.index;

    while (path.charAt(--index) === "\\") {
      escapeCount++;
    }

    // It's possible to escape the bracket.
    if (escapeCount % 2 === 1) {
      continue;
    }

    if (
      keysOffset + i === keys.length ||
      keys[keysOffset + i].offset > m.index
    ) {
      keys.splice(keysOffset + i, 0, {
        name: name++, // Unnamed matching groups must be consistently linear.
        optional: false,
        offset: m.index,
      });
    }

    i++;
  }

  // If the path is non-ending, match until the end or a slash.
  path += end ? "$" : path[path.length - 1] === "/" ? "" : "(?=\\/|$)";

  return new RegExp(path, flags);
}

const cache$1: Record<
  string,
  Record<
    string,
    {
      regexp: RegExp;
      keys: {
        name: number;
        optional: boolean;
        offset: number;
      }[];
    }
  >
> = {};
const cacheLimit$1 = 10000;
let cacheCount$1 = 0;

function compilePath$1(
  path: string,
  options: {
    end: boolean;
    strict: boolean;
    sensitive: boolean;
  }
): {
  regexp: RegExp;
  keys: {
    name: number;
    optional: boolean;
    offset: number;
  }[];
} {
  const cacheKey = "" + options.end + options.strict + options.sensitive;
  const pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  const keys: {
    name: number;
    optional: boolean;
    offset: number;
  }[] = [];
  const regexp = pathtoRegexp(path, keys, options);
  const result = {
    regexp: regexp,
    keys: keys,
  };

  if (cacheCount$1 < cacheLimit$1) {
    pathCache[path] = result;
    cacheCount$1++;
  }

  return result;
}

function computeRootMatch(pathname: string) {
  return {
    path: "/",
    url: "/",
    params: {} as EntryPointParams,
    isExact: pathname === "/",
  };
}

function matchPath(pathname: string, options: EntryPointRoute) {
  const path = options.path;
  const _options$exact = options.exact;
  const exact = _options$exact === undefined ? false : _options$exact;
  const _options$strict = options.strict;
  const strict = _options$strict === undefined ? false : _options$strict;
  const _options$sensitive = options.sensitive;
  const sensitive =
    _options$sensitive === undefined ? false : _options$sensitive;
  const paths = [path];
  return paths.reduce<{
    path: string;
    url: string;
    params: EntryPointParams;
    isExact: boolean;
  } | null>((matchedAccumulator, nextItemPath) => {
    if (!nextItemPath && nextItemPath !== "") return null;
    if (matchedAccumulator) return matchedAccumulator;

    const _compilePath = compilePath$1(nextItemPath, {
        end: exact,
        strict: strict,
        sensitive: sensitive,
      }),
      regexp = _compilePath.regexp,
      keys = _compilePath.keys;

    const match = regexp.exec(pathname);
    if (!match) return null;
    const url = match[0],
      values = match.slice(1);
    const isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path: nextItemPath,
      // the path used to match
      url: nextItemPath === "/" && url === "" ? "/" : url,
      // the matched portion of the URL
      isExact: isExact,
      // whether or not we matched exactly
      params: keys.reduce<Record<string, string>>((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {}) as unknown as EntryPointParams,
    };
  }, null);
}

export interface Route {
  strict?: boolean;
  exact?: boolean;
  sensitive?: boolean;
  path?: string;
  routes?: Route[];
  entryPoint?: CustomSimpleEntryPoint;
}

export function matchRoutes(
  routes: EntryPointRoute[],
  pathname: string,
  branch:
    | undefined
    | {
        route: EntryPointRoute;
        match: {
          path: string;
          url: string;
          params: EntryPointParams;
          isExact: boolean;
        };
      }[] = undefined
) {
  if (branch === undefined) {
    branch = [];
  }

  routes.some((route) => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
        ? branch[branch.length - 1].match
        : computeRootMatch(pathname);

    if (match) {
      branch.push({
        route: route,
        match: match,
      });

      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return match;
  });
  return branch;
}
