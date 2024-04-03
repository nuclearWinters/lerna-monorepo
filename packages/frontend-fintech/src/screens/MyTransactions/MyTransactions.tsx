import { FC, Suspense, useMemo } from "react";
import {
  PreloadedQuery,
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
import { MyTransactionsPaginationUser } from "./__generated__/MyTransactionsPaginationUser.graphql";
import { MyTransactions_user$key } from "./__generated__/MyTransactions_user.graphql";
import { useTranslation } from "../../utils";
import { MyTransactionsQuery } from "./__generated__/MyTransactionsQuery.graphql";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { MyTransactionsTransactionsSubscription } from "./__generated__/MyTransactionsTransactionsSubscription.graphql";
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

type Props = {
  query: PreloadedQuery<MyTransactionsQuery, {}>;
};

export const MyTransactions: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(transactionsFragment, props.query);
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

  if (!user) {
    return null;
  }

  if (data.transactions === null) {
    return <RedirectContainer />;
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
        <Space styleX={customSpace.h20} />
      </WrapperSmall>
    </Main>
  );
};

export default MyTransactions;
