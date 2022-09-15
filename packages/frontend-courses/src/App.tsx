import React, { FC, useCallback } from "react";
import {
  RelayEnvironmentProvider,
  loadQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay/hooks";
import { RelayEnvironment, subscriptionsClient } from "./RelayEnvironment";
import AppQuery, {
  AppUserQuery as AppUserQueryType,
} from "./__generated__/AppUserQuery.graphql";
import AppLoanQuery, {
  AppLoansQuery as AppLoansQueryType,
} from "./__generated__/AppLoansQuery.graphql";
import { graphql } from "react-relay";
import { Routes } from "./Routes";
import { Spinner } from "components/Spinner";
import { Dayjs } from "dayjs";

const { Suspense } = React;

export const tokensAndData: {
  refetchUser: () => void;
  accessToken: string;
  exp?: Dayjs;
} = {
  accessToken: "",
  exp: undefined,
  refetchUser: () => {},
};

const AppUserQuery = graphql`
  query AppUserQuery {
    user {
      ...Routes_user
    }
    authUser {
      ...Routes_auth_user
    }
  }
`;

const AppLoansQuery = graphql`
  query AppLoansQuery {
    __id
    ...AddInvestments_query
  }
`;

export const preloadedQuery = loadQuery<AppUserQueryType>(
  RelayEnvironment,
  AppUserQuery,
  {}
);

export const preloadedLoanQuery = loadQuery<AppLoansQueryType>(
  RelayEnvironment,
  AppLoansQuery,
  {}
);

const AppQueryRoot: FC = () => {
  const [queryRef, loadQuery] = useQueryLoader<AppUserQueryType>(
    AppQuery,
    preloadedQuery
  );
  const data = usePreloadedQuery<AppUserQueryType>(
    AppQuery,
    queryRef || preloadedQuery
  );
  const dataLoans = usePreloadedQuery<AppLoansQueryType>(
    AppLoanQuery,
    preloadedLoanQuery
  );
  const refetchUser = useCallback(() => {
    loadQuery({}, { fetchPolicy: "network-only" });
    subscriptionsClient.restart();
  }, [loadQuery]);
  tokensAndData.refetchUser = refetchUser;
  return (
    <Routes
      user={data.user}
      authUser={data.authUser}
      dataLoans={dataLoans}
      connectionID={dataLoans.__id}
    />
  );
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
