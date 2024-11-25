export function resolvePaths(
    specifier,
    paths
  ) {
    for (const [from, tos] of Object.entries(paths)) {
      const matched = match(specifier, from, tos);
      if (matched !== undefined) {
        return matched;
      }
    }
    return undefined;
  }
  
  function match(
    specifier,
    fromPath,
    toPaths
  ) {
    const parts = fromPath.split("*", 2);
    if (parts.length === 1) {
      // No wildcard
      if (specifier === fromPath) {
        return toPaths;
      }
      return undefined;
    }
    if (parts.length !== 2) {
      throw new Error(`This should not happen: ${fromPath}`);
    }
    const [prefix, suffix] = parts;
    if (!specifier.startsWith(prefix) || !specifier.endsWith(suffix)) {
      return undefined;
    }
    const middle = specifier.slice(prefix.length, -suffix.length || undefined);
    return toPaths.map((toPath) => toPath.replace("*", middle));
  }