import { useEffect, useState, useTransition } from "react";
import { type RouteKeys, type UnionReferences, references } from "../router";
import { matchPath, register, unregister } from "./utils";

export const useRoute = ({
  entryPointReference,
  path,
  exact,
}: {
  entryPointReference: UnionReferences;
  path: RouteKeys;
  exact: boolean;
}) => {
  const [reference, setReference] = useState(entryPointReference);
  const [, startTransition] = useTransition();
  const [match, setMatch] = useState(matchPath(window.location.pathname, { path, exact })?.isExact);

  useEffect(() => {
    const handlePop = () => {
      const newMatch = matchPath(window.location.pathname, {
        path,
        exact,
      })?.isExact;
      if (newMatch !== match) {
        if (newMatch) {
          const reference = references[path].loader();
          setReference(reference);
        }
        startTransition(() => {
          setMatch(newMatch);
        });
      }
    };
    register(handlePop, path);
    window.addEventListener("popstate", handlePop);
    return () => {
      unregister(path);
      window.removeEventListener("popstate", handlePop);
    };
  }, [match, path, exact]);

  return {
    reference,
    match,
  };
};
