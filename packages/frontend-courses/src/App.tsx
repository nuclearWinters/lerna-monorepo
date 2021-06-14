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
import { useTranslation } from "react-i18next";

const { Suspense } = React;

export interface IJWT {
  _id: string;
  iat: number;
  exp: number;
  isLender: boolean;
  isSupport: boolean;
  isBorrower: boolean;
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
    isLender: true,
    isBorrower: false,
    isSupport: false,
  },
};

export const getDataFromToken = (token: string): IJWT => {
  return jwtDecode<IJWT>(token);
};

export const getStatus = () => {
  const user = tokensAndData.data;
  const isLender = user.isLender;
  if (isLender) {
    return ["FINANCING"] as LoanStatus[];
  }
  return ["WAITING_FOR_APPROVAL"] as LoanStatus[];
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
  return <Routes user={data} data={data} refetch={refetch} />;
};

export const App: FC = () => {
  const { t } = useTranslation();
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={t("Loading") + "..."}>
        <AppQueryRoot />
      </Suspense>
    </RelayEnvironmentProvider>
  );
};
