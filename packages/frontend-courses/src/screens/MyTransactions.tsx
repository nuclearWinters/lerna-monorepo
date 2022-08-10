import React, { FC } from "react";
import { graphql, useFragment, usePaginationFragment } from "react-relay";
import { TransactionType } from "./__generated__/MyTransactions_query.graphql";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import en from "date-fns/locale/en-US";
import { CustomButton } from "components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileContract,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { Title } from "components/Title";
import { Rows } from "components/Rows";
import { Space } from "components/Space";
import { Columns } from "components/Colums";
import { useTranslation } from "react-i18next";
import { MyTransactionsPaginationUser } from "./__generated__/MyTransactionsPaginationUser.graphql";
import { MyTransactions_auth_user$key } from "./__generated__/MyTransactions_auth_user.graphql";
import { MyTransactions_user$key } from "./__generated__/MyTransactions_user.graphql";

const transactionsFragment = graphql`
  fragment MyTransactions_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 2 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "MyTransactionsPaginationUser") {
    transactions(first: $count, after: $cursor)
      @connection(key: "MyTransactions_user_transactions") {
      edges {
        node {
          id
          count
          history {
            id
            id_borrower
            _id_loan
            type
            quantity
            created
          }
        }
      }
    }
  }
`;

const transactionsFragmentAuthUser = graphql`
  fragment MyTransactions_auth_user on AuthUser {
    language
  }
`;

type Props = {
  user: MyTransactions_user$key;
  authUser: MyTransactions_auth_user$key;
};

export const MyTransactions: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { data, loadNext, refetch } = usePaginationFragment<
    MyTransactionsPaginationUser,
    MyTransactions_user$key
  >(transactionsFragment, props.user);

  const authUser = useFragment<MyTransactions_auth_user$key>(
    transactionsFragmentAuthUser,
    props.authUser
  );

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

  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Mis movimientos")} />
        <Rows
          style={{
            flex: 1,
            margin: "0px 12px",
          }}
        >
          {data.transactions &&
            data.transactions.edges &&
            data.transactions.edges.map((edge) => {
              const history =
                edge &&
                edge.node &&
                edge.node.history &&
                [...edge.node.history].reverse().map((transaction) => {
                  const color = transaction.quantity.includes("-")
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
                      key={transaction.id}
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
                          {getStatus(transaction.type)}
                        </div>
                        {transaction.id_borrower && (
                          <div
                            style={{
                              fontSize: 16,
                              padding: "4px 0px",
                            }}
                          >
                            {t("Prestado a")}{" "}
                            <FontAwesomeIcon
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  transaction.id_borrower || ""
                                );
                              }}
                              icon={faUserCircle}
                              size={"1x"}
                              color={"rgba(255,90,96,0.5)"}
                              style={{ margin: "0px 4px", cursor: "pointer" }}
                            />{" "}
                            {t("al fondo")}:{" "}
                            <FontAwesomeIcon
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  transaction._id_loan || ""
                                );
                              }}
                              icon={faFileContract}
                              size={"1x"}
                              color={"rgba(255,90,96,0.5)"}
                              style={{ margin: "0px 4px", cursor: "pointer" }}
                            />
                          </div>
                        )}
                        <div style={{ letterSpacing: 1 }}>
                          {format(
                            transaction.created,
                            "d 'de' MMMM 'del' yyyy 'a las' HH:mm:ss",
                            {
                              locale:
                                authUser.language === "DEFAULT"
                                  ? navigator.language.includes("es")
                                    ? es
                                    : en
                                  : authUser.language === "ES"
                                  ? es
                                  : en,
                            }
                          )}
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
                        {transaction.quantity}
                      </div>
                    </div>
                  );
                });
              return <div key={edge?.node?.id}>{history}</div>;
            })}
        </Rows>
        <Space h={20} />
        <Columns
          style={{
            justifyContent: "center",
          }}
        >
          <CustomButton
            text={t("Cargar más")}
            color="secondary"
            onClick={() => loadNext(1)}
          />
          <Space w={20} />
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
        <Space h={20} />
      </WrapperSmall>
    </Main>
  );
};
