import React, { FC, useCallback } from "react";
import {
  RelayEnvironmentProvider,
  loadQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay/hooks";
import { RelayEnvironment } from "./RelayEnvironment";
import AppQuery, {
  AppQuery as AppQueryType,
} from "./__generated__/AppQuery.graphql";
import { graphql } from "react-relay";
import { Routes } from "./Routes";
import jwtDecode from "jwt-decode";

const { Suspense } = React;

interface IJWT {
  _id: string;
}

const getIdFromToken = (): string => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return "";
  return jwtDecode<IJWT>(accessToken)._id;
};

const RepositoryNameQuery = graphql`
  query AppQuery($id: String!) {
    user(id: $id) {
      ...Routes_user
      error
    }
  }
`;

export const preloadedQuery = loadQuery<AppQueryType>(
  RelayEnvironment,
  RepositoryNameQuery,
  { id: getIdFromToken() }
);

const AppQueryRoot: FC = () => {
  const [queryRef, loadQuery] = useQueryLoader<AppQueryType>(
    AppQuery,
    preloadedQuery
  );
  const data = usePreloadedQuery<AppQueryType>(
    AppQuery,
    queryRef || preloadedQuery
  );
  const refetch = useCallback(() => {
    loadQuery({ id: getIdFromToken() });
  }, [loadQuery]);
  return <Routes user={data.user} refetch={refetch} />;
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
