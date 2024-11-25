import { useEffect, useState } from "react";

export const matchPath = (pathname: string, options: { exact?: boolean; path?: string }) => {
  const { exact = false, path } = options;

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true,
    };
  }

  const match = new RegExp(`^${path}`).exec(pathname);

  if (!match) {
    return null;
  }

  const url = match[0];
  const isExact = pathname === url;

  if (exact && !isExact) {
    return null;
  }

  return {
    path,
    url,
    isExact,
  };
};

const map = new Map<string, () => void>();
const set = new Set<() => void>();

export const register = (forceUpdate: () => void, path: string) => {
  map.set(path, forceUpdate);
};

export const unregister = (path: string) => {
  map.delete(path);
};

export const registerSet = (forceUpdate: () => void) => {
  set.add(forceUpdate);
};

export const unregisterSet = (forceUpdate: () => void) => {
  set.delete(forceUpdate);
};

export const historyPush = (path: string) => {
  const prevPage = map.get(window.location.pathname);
  window.history.pushState({}, "", path);
  const nextPage = map.get(path);
  prevPage?.();
  nextPage?.();
  for (const forceUpdate of set) {
    forceUpdate();
  }
};

export const historyReplace = (path: string) => {
  const prevPage = map.get(window.location.pathname);
  window.history.replaceState({}, "", path);
  const nextPage = map.get(path);
  prevPage?.();
  nextPage?.();
  for (const forceUpdate of set) {
    forceUpdate();
  }
};

export const useLocation = () => {
  const [location, setLocation] = useState(window.location.pathname);
  useEffect(() => {
    const handlePop = () => {
      setLocation(window.location.pathname);
    };
    registerSet(handlePop);
    window.addEventListener("popstate", handlePop);
    return () => {
      unregisterSet(handlePop);
      window.removeEventListener("popstate", handlePop);
    };
  }, []);
  return location;
};
