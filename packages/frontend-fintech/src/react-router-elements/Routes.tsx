import { FC, ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { EntryPointContainer, PreloadedEntryPoint } from "react-relay";
import { GetEntryPointComponentFromEntryPoint } from "react-relay/relay-hooks/helpers";
import { HeaderAuthEntryPoint } from "../authSrc/screens/HeaderAuth/HeaderAuth.entrypoint";
import { useRoute } from "./RouteHooks";
import { references, RouteKeys } from "../router";

export const Routes: FC<{
  children: ReactNode;
  entryPointReference: PreloadedEntryPoint<
    GetEntryPointComponentFromEntryPoint<typeof HeaderAuthEntryPoint>
  >;
}> = ({ children, entryPointReference }) => {
  return (
    <ErrorBoundary>
      <EntryPointContainer
        entryPointReference={entryPointReference}
        props={{ children }}
      />
    </ErrorBoundary>
  );
};

export const Route = <T extends RouteKeys>(props: { path: T }) => {
  const { path } = props;
  const { reference, match } = useRoute({
    entryPointReference: references[path].entrypoint,
    path,
    exact: true,
  });
  if (!match || !reference) return null;

  return <EntryPointContainer entryPointReference={reference} props={{}} />;
};
