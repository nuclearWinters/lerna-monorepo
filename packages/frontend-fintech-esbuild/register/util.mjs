export function parentDir(url) {
    const result = new URL(url);
    result.pathname = result.pathname.replace(/\/[^/]+$/, "");
    return result;
  }