import React, { FC, useMemo, useState } from "react";
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
import {
  baseMyTransactionsBar,
  baseMyTransactionsBox,
  baseMyTransactionsDate,
  baseMyTransactionsDescription,
  baseMyTransactionsIcon,
  customMyTransactionsQuantity,
  customMyTransactionsStatus,
} from "./MyTransactions.css";
import { nanoid } from "nanoid";

const transactionsFragment = graphql`
  query MyTransactionsQuery($identifier: String) {
    user {
      id
      ...MyTransactions_user @arguments(identifier: $identifier)
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
    identifier: { type: "String" }
  )
  @refetchable(queryName: "MyTransactionsPaginationUser") {
    transactions(first: $count, after: $cursor, identifier: $identifier)
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
    id?: string;
    query: PreloadedQuery<MyTransactionsQuery, {}>;
  };
};

export const MyTransactions: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState(props.preloaded.id || nanoid());
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
    { identifier }
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

  const language =
    authUser.language === "DEFAULT"
      ? navigator.language.includes("es")
        ? "ES"
        : "EN"
      : authUser.language === "ES"
      ? "ES"
      : "EN";

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
                const substraction = edge.node.quantity.includes("-")
                  ? "#CD5C5C"
                  : "#50C878";
                return (
                  <div className={baseMyTransactionsBox} key={edge.node.id}>
                    <div className={baseMyTransactionsBar}>
                      <div
                        className={
                          substraction
                            ? customMyTransactionsStatus["substraction"]
                            : customMyTransactionsStatus["addition"]
                        }
                      >
                        {getStatus(edge.node.type)}
                      </div>
                      {id_borrower && _id_loan ? (
                        <div className={baseMyTransactionsDescription}>
                          {t("Prestado a")}{" "}
                          <FaUserCircle
                            onClick={() => {
                              navigator.clipboard.writeText(id_borrower);
                            }}
                            className={baseMyTransactionsIcon}
                          />{" "}
                          {t("al fondo")}:{" "}
                          <FaFileContract
                            onClick={() => {
                              navigator.clipboard.writeText(_id_loan);
                            }}
                            className={baseMyTransactionsIcon}
                          />
                        </div>
                      ) : null}
                      <div className={baseMyTransactionsDate}>
                        {dayjs(edge.node.created)
                          .locale(language === "ES" ? es : en)
                          .format(
                            authUser.language === "ES"
                              ? "D [de] MMMM [del] YYYY [a las] h:mm a"
                              : "D MMMM[,] YYYY [at] h:mm a"
                          )}
                      </div>
                    </div>
                    <div
                      className={
                        substraction
                          ? customMyTransactionsQuantity["substraction"]
                          : customMyTransactionsQuantity["addition"]
                      }
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
            onClick={() => {
              const newId = nanoid();
              refetch(
                { identifier: newId },
                {
                  fetchPolicy: "network-only",
                  onComplete: () => {
                    setIdentifier(newId);
                  },
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
