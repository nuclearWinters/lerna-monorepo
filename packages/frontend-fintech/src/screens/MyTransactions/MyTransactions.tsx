import { FC, Suspense, useMemo, useState } from "react";
import {
  usePaginationFragment,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { CustomButton } from "../../components/CustomButton";
import { Main } from "../../components/Main";
import { WrapperSmall } from "../../components/WrapperSmall";
import { Title } from "../../components/Title";
import { Rows, baseRows } from "../../components/Rows";
import { Space, customSpace } from "../../components/Space";
import { Columns, baseColumn } from "../../components/Colums";
import { authUserQuery, useTranslation } from "../../utils";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import RelayMatchContainer from "../../RelayMatchContainer";
import { Spinner } from "../../components/Spinner";
import { baseApp } from "../../App";
import * as stylex from "@stylexjs/stylex";
import {
  subscriptionTransactions,
  transactionsFragment,
  transactionsPaginationFragment,
} from "./MyTransactionsQueries";
import { RedirectContainer } from "../../components/RedirectContainer";
import { utilsQuery } from "../../__generated__/utilsQuery.graphql";
import { MyTransactionsQueriesQuery } from "./__generated__/MyTransactionsQueriesQuery.graphql";
import { MyTransactionsQueriesPaginationUser } from "./__generated__/MyTransactionsQueriesPaginationUser.graphql";
import { MyTransactionsQueries_user$key } from "./__generated__/MyTransactionsQueries_user.graphql";
import { MyTransactionsQueriesSubscription } from "./__generated__/MyTransactionsQueriesSubscription.graphql";
import { SimpleEntryPointProps } from "@loop-payments/react-router-relay";

type Props = SimpleEntryPointProps<{
  query: MyTransactionsQueriesQuery;
  authQuery: utilsQuery;
}>;

export const MyTransactions: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [reset, setReset] = useState(0);
  const { user } = usePreloadedQuery(transactionsFragment, props.queries.query);
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );
  const { data, loadNext, refetch } = usePaginationFragment<
    MyTransactionsQueriesPaginationUser,
    MyTransactionsQueries_user$key
  >(transactionsPaginationFragment, user);

  const connectionTransactionID = ConnectionHandler.getConnectionID(
    user?.id || "",
    "MyTransactionsQueries_user_transactions",
    {
      reset,
    }
  );

  const configTransactions = useMemo<
    GraphQLSubscriptionConfig<MyTransactionsQueriesSubscription>
  >(
    () => ({
      variables: { connections: [connectionTransactionID], reset },
      subscription: subscriptionTransactions,
    }),
    [connectionTransactionID, reset]
  );
  useSubscription<MyTransactionsQueriesSubscription>(configTransactions);

  if (!user || !authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isSupport) {
    return (
      <RedirectContainer
        allowed={["lender", "borrower"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Mis movimientos")} />
        <Rows styleX={[baseRows.base, baseRows.transactions]}>
          <Suspense
            fallback={
              <div {...stylex.props(baseApp.base)}>
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
        <Space styleX={customSpace.h20} />
        <Columns styleX={[baseColumn.base, baseColumn.columnJustifyCenter]}>
          <CustomButton
            text={t("Cargar más")}
            color="secondary"
            onClick={() => loadNext(5)}
          />
          <Space styleX={customSpace.w20} />
          <CustomButton
            text={t("Reiniciar lista")}
            color="secondary"
            onClick={() => {
              const time = new Date().getTime();
              setReset(time);
              refetch(
                {
                  count: 5,
                  cursor: "",
                  reset: time,
                },
                {
                  fetchPolicy: "network-only",
                }
              );
            }}
          />
        </Columns>
        <Space styleX={customSpace.h20} />
      </WrapperSmall>
    </Main>
  );
};

export default MyTransactions;
