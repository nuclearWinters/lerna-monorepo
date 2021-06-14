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
import { LoanStatus } from "__generated__/RoutesLoansSubscription.graphql";
import { Spinner } from "components/Spinner";

const { Suspense } = React;

export interface IJWT {
  _id: string;
  iat: number;
  exp: number;
}

export const tokensAndData: {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  data: IJWT;
} = {
  tokens: {
    accessToken: "",
    refreshToken: "",
  },
  data: {
    _id: "",
    iat: 0,
    exp: 0,
  },
};

export const getDataFromToken = (token: string): IJWT => {
  return jwtDecode<IJWT>(token);
};

const RepositoryNameQuery = graphql`
  query AppQuery($id: String!, $status: [LoanStatus!]!, $borrower_id: String) {
    ...AddInvestments_query
    ...MyTransactions_query
    ...MyInvestments_query
    ...Routes_query
  }
`;

export const preloadedQuery = loadQuery<AppQueryType>(
  RelayEnvironment,
  RepositoryNameQuery,
  {
    id: "",
    status: ["FINANCING"],
    borrower_id: null,
  }
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
  const refetchUser = useCallback(
    (status: LoanStatus[], id: string, borrower_id?: string | null) => {
      loadQuery(
        {
          id,
          status,
          borrower_id,
        },
        { fetchPolicy: "network-only" }
      );
    },
    [loadQuery]
  );
  return <Routes user={data} data={data} refetchUser={refetchUser} />;
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
