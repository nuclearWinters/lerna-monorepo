import { FC, ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { EntryPointContainer, PreloadedEntryPoint } from "react-relay";

export const Routes: FC<{
  children: ReactNode;
  entryPointReference: PreloadedEntryPoint<any>;
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
