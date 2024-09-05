import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { matchPath, register, unregister } from "./utils";
import {
  EntryPoint,
  EntryPointContainer,
  PreloadedEntryPoint,
} from "react-relay";
import { GetEntryPointComponentFromEntryPoint } from "react-relay/relay-hooks/helpers";
import { references } from "../router";

export const Route = <T extends EntryPoint<any, any>>({
  path,
  exact = false,
  entryPointReference,
}: {
  path: string;
  exact?: boolean;
  entryPointReference: PreloadedEntryPoint<
    GetEntryPointComponentFromEntryPoint<T>
  > | null;
}): ReactNode => {
  const [reference, setReference] = useState(entryPointReference);
  const [, startTransition] = useTransition();
  const [match, setMatch] = useState(
    matchPath(window.location.pathname, { path, exact })
  );
  const matchRef = useRef(match);

  useEffect(() => {
    matchRef.current = match;
  }, [match]);

  useEffect(() => {
    const handlePop = () => {
      const newMatch = matchPath(window.location.pathname, { path, exact });
      if (newMatch !== matchRef.current) {
        if (newMatch) {
          const reference = references[path as "/"].loader();
          setReference(reference as any);
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
  }, [path, exact]);

  if (!match || !reference) return null;

  return (
    <EntryPointContainer entryPointReference={reference} props={{} as any} />
  );
};
