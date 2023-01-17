import React, { FC, Suspense, useMemo } from "react";
import {
  graphql,
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { CustomButton } from "components/CustomButton";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { Title } from "components/Title";
import { Rows } from "components/Rows";
import { Space } from "components/Space";
import { Columns } from "components/Colums";
import { MyTransactionsPaginationUser } from "./__generated__/MyTransactionsPaginationUser.graphql";
import { MyTransactions_user$key } from "./__generated__/MyTransactions_user.graphql";
import { useTranslation } from "utils";
import { MyTransactionsQuery } from "./__generated__/MyTransactionsQuery.graphql";
import { customColumn } from "components/Column.css";
import { customRows } from "components/Rows.css";
import { customSpace } from "components/Space.css";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { MyTransactionsTransactionsSubscription } from "./__generated__/MyTransactionsTransactionsSubscription.graphql";
import RelayMatchContainer from "RelayMatchContainer";
import { baseApp } from "App.css";
import { Spinner } from "components/Spinner";

const transactionsFragment = graphql`
  query MyTransactionsQuery {
    user {
      id
      ...MyTransactions_user
    }
    authUser {
      language
    }
  }
`;

const subscriptionTransactions = graphql`
  subscription MyTransactionsTransactionsSubscription($connections: [ID!]!) {
    transactions_subscribe_insert @prependEdge(connections: $connections) {
      node {
        __id
        ...InvestmentTransaction_transaction
          @module(name: "InvestmentTransaction")
        ...MoneyTransaction_transaction @module(name: "MoneyTransaction")
      }
      cursor
    }
  }
`;

const transactionsPaginationFragment = graphql`
  fragment MyTransactions_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "MyTransactionsPaginationUser") {
    transactions(first: $count, after: $cursor)
      @connection(key: "MyTransactions_user_transactions") {
      edges {
        node {
          __id
          ...InvestmentTransaction_transaction
            @module(name: "InvestmentTransaction")
          ...MoneyTransaction_transaction @module(name: "MoneyTransaction")
        }
      }
    }
  }
`;

type Props = {
  preloaded: {
    query: PreloadedQuery<MyTransactionsQuery, {}>;
  };
};

export const MyTransactions: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(
    transactionsFragment,
    props.preloaded.query
  );
  const { data, loadNext, refetch } = usePaginationFragment<
    MyTransactionsPaginationUser,
    MyTransactions_user$key
  >(transactionsPaginationFragment, user);

  const connectionTransactionID = ConnectionHandler.getConnectionID(
    user.id,
    "MyTransactions_user_transactions",
    {}
  );

  const configTransactions = useMemo<
    GraphQLSubscriptionConfig<MyTransactionsTransactionsSubscription>
  >(
    () => ({
      variables: { connections: [connectionTransactionID] },
      subscription: subscriptionTransactions,
    }),
    [connectionTransactionID]
  );
  useSubscription<MyTransactionsTransactionsSubscription>(configTransactions);

  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Mis movimientos")} />
        <Rows className={customRows["transactions"]}>
          <Suspense
            fallback={
              <div className={baseApp}>
                <Spinner />
              </div>
            }
          >
            {data?.transactions?.edges?.map((edge) => {
              if (edge && edge.node) {
                return (
                  <RelayMatchContainer key={edge.node.__id} match={edge.node} />
                );
              }
              return null;
            })}
          </Suspense>
        </Rows>
        <Space className={customSpace["h20"]} />
        <Columns className={customColumn["columnJustifyCenter"]}>
          <CustomButton
            text={t("Cargar más")}
            color="secondary"
            onClick={() => loadNext(5)}
          />
          <Space className={customSpace["w20"]} />
          <CustomButton
            text={t("Refrescar lista")}
            color="secondary"
            onClick={() => {
              refetch(
                {},
                {
                  fetchPolicy: "network-only",
                }
              );
            }}
          />
        </Columns>
        <Space className={customSpace["h20"]} />
      </WrapperSmall>
    </Main>
  );
};
