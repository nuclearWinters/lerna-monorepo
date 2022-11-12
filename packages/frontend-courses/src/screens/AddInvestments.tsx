import React, { CSSProperties, FC, useMemo, useState } from "react";
import {
  ConnectionHandler,
  graphql,
  PreloadedQuery,
  useMutation,
  usePaginationFragment,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { AddInvestmentsMutation } from "./__generated__/AddInvestmentsMutation.graphql";
import { tokensAndData } from "App";
import { LoanRow } from "components/LoanRow";
import { Spinner } from "components/Spinner";
import { CustomButton } from "components/CustomButton";
import { Main } from "components/Main";
import { Title } from "components/Title";
import { WrapperBig } from "components/WrapperBig";
import { Rows } from "components/Rows";
import { Space } from "components/Space";
import { Columns } from "components/Colums";
import { TableColumnName } from "components/TableColumnName";
import { Table } from "components/Table";
import { logOut, useTranslation } from "utils";
import { AddInvestmentsPaginationQuery } from "./__generated__/AddInvestmentsPaginationQuery.graphql";
import { AddInvestments_query$key } from "./__generated__/AddInvestments_query.graphql";
import { AddInvestmentsQuery } from "./__generated__/AddInvestmentsQuery.graphql";
import { useNavigation } from "yarr";
import { customColumn } from "components/Column.css";
import { customRows } from "components/Rows.css";
import { customSpace } from "components/Space.css";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { AddInvestmentsLoansSubscription } from "./__generated__/AddInvestmentsLoansSubscription.graphql";

const subscriptionLoans = graphql`
  subscription AddInvestmentsLoansSubscription($connections: [ID!]!) {
    loans_subscribe_insert @prependEdge(connections: $connections) {
      node {
        id
        id_user
        score
        ROI
        goal
        term
        raised
        expiry
        status
        scheduledPayments {
          amortize
          status
          scheduledDate
        }
        pending
        pendingCents
      }
      cursor
    }
  }
`;

const addInvestmentFragment = graphql`
  query AddInvestmentsQuery {
    __id
    ...AddInvestments_query
    authUser {
      isLender
      isSupport
      isBorrower
      language
      accountId
    }
  }
`;

const addInvestmentPaginationFragment = graphql`
  fragment AddInvestments_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "AddInvestmentsPaginationQuery") {
    loansFinancing(first: $count, after: $cursor)
      @connection(key: "AddInvestments_query_loansFinancing") {
      __id
      edges {
        node {
          id
          ...LoanRow_loan
        }
      }
    }
  }
`;

type Props = {
  preloaded: {
    query: PreloadedQuery<AddInvestmentsQuery, {}>;
  };
};

interface ILends {
  loan_gid: string;
  quantity: string;
  borrower_id: string;
  goal: string;
  ROI: number;
  term: number;
}

export const AddInvestments: FC<Props> = (props) => {
  const { t } = useTranslation();
  const preloadData = usePreloadedQuery(
    addInvestmentFragment,
    props.preloaded.query
  );
  const { authUser } = preloadData;
  const [commit, isInFlight] = useMutation<AddInvestmentsMutation>(graphql`
    mutation AddInvestmentsMutation($input: AddLendsInput!) {
      addLends(input: $input) {
        error
        validAccessToken
      }
    }
  `);
  const navigate = useNavigation();
  const { data, loadNext, refetch } = usePaginationFragment<
    AddInvestmentsPaginationQuery,
    AddInvestments_query$key
  >(addInvestmentPaginationFragment, preloadData);

  const { isLender, isSupport, isBorrower, language } = authUser;

  const columns = [
    { key: "id", title: t("ID") },
    { key: "id_user", title: t("Solicitante") },
    { key: "score", title: t("Calif.") },
    { key: "ROI", title: t("Retorno anual") },
    { key: "goal", title: t("Monto") },
    { key: "term", title: t("Periodo") },
    { key: "pending", title: t("Faltan") },
    { key: "expiry", title: t("Termina") },
    { key: "lend", title: t("Prestar") },
    { key: "refetech", title: t("Refrescar") },
  ];

  const [lends, setLends] = useState<ILends[]>([]);

  const getValue = (id: string) => {
    const lend = lends.find((lend) => id === lend.loan_gid);
    if (!lend) {
      return "";
    }
    return lend.quantity;
  };

  const total = lends.reduce((acc, item) => {
    return acc + Number(item.quantity);
  }, 0);

  const connectionLoanID = ConnectionHandler.getConnectionID(
    preloadData.__id,
    "AddInvestments_query_loansFinancing",
    {}
  );
  const configLoans = useMemo<
    GraphQLSubscriptionConfig<AddInvestmentsLoansSubscription>
  >(
    () => ({
      variables: {
        connections: [connectionLoanID],
      },
      subscription: subscriptionLoans,
    }),
    [connectionLoanID]
  );
  useSubscription<AddInvestmentsLoansSubscription>(configLoans);

  return (
    <Main>
      <WrapperBig>
        <Title text={t("Solicitudes")} />
        <Table color="primary">
          <Rows className={customRows["flex1"]}>
            <Columns>
              {isBorrower ? <Space className={customSpace["w30"]} /> : null}
              {columns.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
            {data.loansFinancing &&
              data.loansFinancing.edges &&
              data.loansFinancing.edges.map((edge) => {
                if (edge && edge.node) {
                  const value = getValue(edge.node.id);
                  return (
                    <LoanRow
                      key={edge.node.id}
                      setLends={setLends}
                      loan={edge.node}
                      value={value}
                      isLender={isLender}
                      isSupport={isSupport}
                      isBorrower={isBorrower}
                      language={language}
                    />
                  );
                }
                return null;
              })}
          </Rows>
          {isLender && (
            <Rows className={customRows["lender"]}>
              {isInFlight ? (
                <Spinner />
              ) : (
                <div style={styles.prestarWrapper}>
                  <Space className={customSpace["h30"]} />
                  <CustomButton
                    text={t("Prestar")}
                    onClick={() => {
                      if (!authUser.accountId) {
                        return navigate.push("/login");
                      }
                      commit({
                        variables: {
                          input: {
                            lends: lends.map((lend) => ({
                              ...lend,
                              quantity: lend.quantity,
                            })),
                          },
                        },
                        onCompleted: (response) => {
                          if (response.addLends.error) {
                            if (response.addLends.error === "jwt expired") {
                              logOut();
                            }
                            return window.alert(response.addLends.error);
                          }
                          tokensAndData.accessToken =
                            response.addLends.validAccessToken;
                        },
                      });
                      setLends([]);
                    }}
                  />
                  <div style={{ marginTop: 14, fontWeight: "bold" }}>
                    {t("Total")}
                    {`: $${total}`}
                  </div>
                  <div style={{ marginTop: 14, fontWeight: "bold" }}>
                    {t("Inversiones")}: {lends.length}
                  </div>
                  <Space className={customSpace["h30"]} />
                </div>
              )}
            </Rows>
          )}
        </Table>
        <Space className={customSpace["h20"]} />
        <Columns className={customColumn["columnJustifyCenter"]}>
          <CustomButton
            color="secondary"
            text={t("Cargar más")}
            onClick={() => loadNext(5)}
          />
          <Space className={customSpace["w20"]} />
          <CustomButton
            text={t("Refrescar lista")}
            color="secondary"
            onClick={() =>
              refetch(
                {
                  count: 5,
                  cursor: "",
                },
                { fetchPolicy: "network-only" }
              )
            }
          />
        </Columns>
        <Space className={customSpace["h20"]} />
      </WrapperBig>
    </Main>
  );
};

const styles: Record<"prestarWrapper", CSSProperties> = {
  prestarWrapper: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "16px",
    padding: "30px 0px",
  },
};
