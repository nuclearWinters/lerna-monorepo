import React, { FC, useMemo } from "react";
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
import {
  MyTransactions_user$key,
  TransactionType,
} from "./__generated__/MyTransactions_user.graphql";
import es from "dayjs/locale/es";
import en from "dayjs/locale/en";
import dayjs from "dayjs";
import { useTranslation } from "utils";
import { FaFileContract, FaUserCircle } from "react-icons/fa";
import { MyTransactionsQuery } from "./__generated__/MyTransactionsQuery.graphql";
import { customColumn } from "components/Column.css";
import { customRows } from "components/Rows.css";
import { customSpace } from "components/Space.css";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { MyTransactionsTransactionsSubscription } from "./__generated__/MyTransactionsTransactionsSubscription.graphql";

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
        id
        id_user
        id_borrower
        _id_loan
        type
        quantity
        created
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
    firstFetch: { type: "Boolean", defaultValue: true }
  )
  @refetchable(queryName: "MyTransactionsPaginationUser") {
    transactions(first: $count, after: $cursor, firstFetch: $firstFetch)
      @connection(key: "MyTransactions_user_transactions") {
      edges {
        node {
          id
          id_user
          id_borrower
          _id_loan
          type
          quantity
          created
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
  const { user, authUser } = usePreloadedQuery(
    transactionsFragment,
    props.preloaded.query
  );
  const { data, loadNext, refetch } = usePaginationFragment<
    MyTransactionsPaginationUser,
    MyTransactions_user$key
  >(transactionsPaginationFragment, user);

  const getStatus = (type: TransactionType) => {
    switch (type) {
      case "COLLECT":
        return t("Pago mensual");
      case "CREDIT":
        return t("Ingreso");
      case "INVEST":
        return t("Inversión");
      case "WITHDRAWAL":
        return t("Retiro");
      default:
        return "";
    }
  };

  const connectionTransactionID = ConnectionHandler.getConnectionID(
    user.id,
    "MyTransactions_user_transactions",
    {
      firstFetch: true,
    }
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
          {data.transactions &&
            data.transactions.edges &&
            data.transactions.edges.map((edge) => {
              if (edge && edge.node) {
                const { id_borrower, _id_loan } = edge.node;
                const color = edge.node.quantity.includes("-")
                  ? "#CD5C5C"
                  : "#50C878";
                return (
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      borderBottom: "1px solid rgb(203,203,203)",
                    }}
                    key={edge.node.id}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        margin: "12px 0px",
                      }}
                    >
                      <div style={{ fontSize: 18, color }}>
                        {getStatus(edge.node.type)}
                      </div>
                      {id_borrower && _id_loan ? (
                        <div
                          style={{
                            fontSize: 16,
                            padding: "4px 0px",
                          }}
                        >
                          {t("Prestado a")}{" "}
                          <FaUserCircle
                            onClick={() => {
                              navigator.clipboard.writeText(id_borrower);
                            }}
                            size={18}
                            color={"rgba(255,90,96,0.5)"}
                            style={{ margin: "0px 4px", cursor: "pointer" }}
                          />{" "}
                          {t("al fondo")}:{" "}
                          <FaFileContract
                            onClick={() => {
                              navigator.clipboard.writeText(_id_loan);
                            }}
                            size={18}
                            color={"rgba(255,90,96,0.5)"}
                            style={{ margin: "0px 4px", cursor: "pointer" }}
                          />
                        </div>
                      ) : null}
                      <div style={{ letterSpacing: 1 }}>
                        {dayjs(edge.node.created)
                          .locale(
                            authUser.language === "DEFAULT"
                              ? navigator.language.includes("es")
                                ? es
                                : en
                              : authUser.language === "ES"
                              ? es
                              : en
                          )
                          .format("d 'de' MMMM 'del' yyyy 'a las' HH:mm:ss")}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        color,
                      }}
                    >
                      {edge.node.quantity}
                    </div>
                  </div>
                );
              }
              return null;
            })}
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
            onClick={() =>
              refetch(
                {
                  count: 2,
                  cursor: "",
                },
                { fetchPolicy: "network-only" }
              )
            }
          />
        </Columns>
        <Space className={customSpace["h20"]} />
      </WrapperSmall>
    </Main>
  );
};
