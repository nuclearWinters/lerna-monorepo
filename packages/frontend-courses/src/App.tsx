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
import { LoanStatus } from "./__generated__/AppQuery.graphql";

const { Suspense } = React;

export interface IJWT {
  _id: string;
  email: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
}

export const tokensAndData = {
  tokens: {
    accessToken: "",
    refreshToken: "",
  },
  data: {
    isLender: true,
    isBorrower: false,
    isSupport: false,
    email: "",
    _id: "",
    iat: 0,
    exp: 0,
  },
};

export const getDataFromToken = (token: string): IJWT => {
  return jwtDecode<IJWT>(token);
};

export const getStatus = () => {
  const user = tokensAndData.data;
  const isLender = user.isLender;
  const status: LoanStatus[] = [];
  if (isLender) {
    status.push("FINANCING");
  }
  if (!status.length) return undefined;
  return status;
};

const RepositoryNameQuery = graphql`
  query AppQuery($id: String!, $status: [LoanStatus!], $borrower_id: String) {
    ...AddInvestments_query
    ...MyTransactions_query
    ...MyInvestments_query
    user(id: $id) {
      ...Routes_user
    }
  }
`;

export const preloadedQuery = loadQuery<AppQueryType>(
  RelayEnvironment,
  RepositoryNameQuery,
  {
    id: tokensAndData.data._id,
    status: getStatus(),
    borrower_id: tokensAndData.data.isBorrower
      ? tokensAndData.data._id
      : undefined,
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
  const refetch = useCallback(() => {
    loadQuery(
      {
        id: tokensAndData.data._id,
        status: getStatus(),
        borrower_id: tokensAndData.data.isBorrower
          ? tokensAndData.data._id
          : undefined,
      },
      { fetchPolicy: "network-only" }
    );
  }, [loadQuery]);
  return <Routes user={data.user} data={data} refetch={refetch} />;
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
