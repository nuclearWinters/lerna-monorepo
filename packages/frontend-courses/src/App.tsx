import React, { Dispatch, FC, SetStateAction, useCallback } from "react";
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
import { Spinner } from "components/Spinner";

const { Suspense } = React;

export const tokensAndData: {
  refetchUser: () => void;
  accessToken: string;
  exp?: Date;
  setToken: Dispatch<SetStateAction<string>>;
} = {
  accessToken: "",
  exp: undefined,
  refetchUser: () => {},
  setToken: () => {},
};

const RepositoryNameQuery = graphql`
  query AppQuery {
    user {
      ...Routes_user
    }
    authUser {
      ...Routes_auth_user
    }
  }
`;

export const preloadedQuery = loadQuery<AppQueryType>(
  RelayEnvironment,
  RepositoryNameQuery,
  {}
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
  const refetchUser = useCallback(() => {
    loadQuery({}, { fetchPolicy: "network-only" });
  }, [loadQuery]);
  tokensAndData.refetchUser = refetchUser;
  return <Routes user={data.user} authUser={data.authUser} />;
};

export const App: FC = () => {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense
        fallback={
          <div
            style={{
              height: "100vh",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </div>
        }
      >
        <AppQueryRoot />
      </Suspense>
    </RelayEnvironmentProvider>
  );
};
