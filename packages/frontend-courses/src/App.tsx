import React, { FC } from "react";
import {
  RelayEnvironmentProvider,
  loadQuery,
  usePreloadedQuery,
} from "react-relay/hooks";
import RelayEnvironment from "./RelayEnvironment";
import { AppQuery } from "./__generated__/AppQuery.graphql";
import { graphql } from "react-relay";
import { Routes } from "./Routes";

const { Suspense } = React;

const RepositoryNameQuery = graphql`
  query AppQuery {
    user(id: "facebook") {
      ...Routes_user
    }
  }
`;

export const preloadedQuery = loadQuery<AppQuery>(
  RelayEnvironment,
  RepositoryNameQuery,
  {}
);

const AppQueryRoot: FC = () => {
  const data = usePreloadedQuery<AppQuery>(RepositoryNameQuery, preloadedQuery);
  return <Routes user={data.user} />;
};

export const App: FC = () => {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={"Loading..."}>
        <AppQueryRoot />
      </Suspense>
    </RelayEnvironmentProvider>
  );
};
