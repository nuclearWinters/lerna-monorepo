import type { FC, ReactNode } from "react";
import { EntryPointContainer, type PreloadedEntryPoint } from "react-relay";
import type { GetEntryPointComponentFromEntryPoint } from "react-relay/relay-hooks/helpers";
import type { HeaderAuthEntryPoint } from "../authSrc/screens/HeaderAuth/HeaderAuth.entrypoint";
import { type RouteKeys, references } from "../router";
import ErrorBoundary from "./ErrorBoundary";
import { useRoute } from "./RouteHooks";

export const Routes: FC<{
  children: ReactNode;
  entryPointReference: PreloadedEntryPoint<GetEntryPointComponentFromEntryPoint<typeof HeaderAuthEntryPoint>>;
}> = ({ children, entryPointReference }) => {
  return (
    <ErrorBoundary>
      <EntryPointContainer entryPointReference={entryPointReference} props={{ children }} />
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
