import { FC, useEffect, useRef, useState, useTransition } from "react";
import { matchPath, register, unregister } from "./utils";
import { EntryPointContainer, PreloadedEntryPoint } from "react-relay";
import { GetEntryPointComponentFromEntryPoint } from "react-relay/relay-hooks/helpers";
import { references } from "../router";
import { LogInEntryPoint } from "../authSrc/screens/LogIn/LogIn.entrypoint";

const path = "/" as const;
const exact = true;

export const RouteLogin: FC<{
  entryPointReference: PreloadedEntryPoint<
    GetEntryPointComponentFromEntryPoint<typeof LogInEntryPoint>
  > | null;
}> = ({ entryPointReference }) => {
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
  }, []);

  if (!match || !reference) return null;

  return <EntryPointContainer entryPointReference={reference} props={{}} />;
};
