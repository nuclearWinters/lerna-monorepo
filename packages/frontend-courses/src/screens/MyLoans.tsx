import React, { FC, useMemo, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { LoanRow } from "components/LoanRow";
import { CustomButton } from "components/CustomButton";
import { Main } from "components/Main";
import { Title } from "components/Title";
import { WrapperBig } from "components/WrapperBig";
import { Rows } from "components/Rows";
import { Space } from "components/Space";
import { Columns } from "components/Colums";
import { TableColumnName } from "components/TableColumnName";
import { Table } from "components/Table";
import { MyLoans_user$key } from "./__generated__/MyLoans_user.graphql";
import { MyLoansPaginationUser } from "./__generated__/MyLoansPaginationUser.graphql";
import { useTranslation } from "utils";
import { MyLoansQuery } from "./__generated__/MyLoansQuery.graphql";
import { customColumn } from "components/Column.css";
import { customRows } from "components/Rows.css";
import { customSpace } from "components/Space.css";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { MyLoansMyLoansSubscription } from "./__generated__/MyLoansMyLoansSubscription.graphql";

const myLoansFragment = graphql`
  query MyLoansQuery {
    user {
      id
      ...MyLoans_user
    }
    authUser {
      isLender
      isSupport
      isBorrower
      language
      accountId
    }
  }
`;

const subscriptionMyLoans = graphql`
  subscription MyLoansMyLoansSubscription($connections: [ID!]!) {
    my_loans_subscribe_insert @prependEdge(connections: $connections) {
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

const myLoansPaginationFragment = graphql`
  fragment MyLoans_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "MyLoansPaginationUser") {
    myLoans(first: $count, after: $cursor)
      @connection(key: "MyLoans_user_myLoans") {
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
    query: PreloadedQuery<MyLoansQuery, {}>;
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

export const MyLoans: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { user, authUser } = usePreloadedQuery(
    myLoansFragment,
    props.preloaded.query
  );
  const { data, loadNext, refetch } = usePaginationFragment<
    MyLoansPaginationUser,
    MyLoans_user$key
  >(myLoansPaginationFragment, user);

  const { isLender, isSupport, isBorrower, language } = authUser;

  const connectionMyLoansID = ConnectionHandler.getConnectionID(
    user.id,
    "MyLoans_user_myLoans",
    {}
  );

  const configMyLoans = useMemo<
    GraphQLSubscriptionConfig<MyLoansMyLoansSubscription>
  >(
    () => ({
      variables: {
        connections: [connectionMyLoansID],
      },
      subscription: subscriptionMyLoans,
    }),
    [connectionMyLoansID]
  );
  useSubscription<MyLoansMyLoansSubscription>(configMyLoans);

  const columns = [
    { key: "id", title: t("ID") },
    { key: "id_user", title: t("Solicitante") },
    { key: "score", title: t("Calif.") },
    { key: "ROI", title: t("Retorno anual") },
    { key: "goal", title: t("Monto") },
    { key: "term", title: t("Periodo") },
    { key: "pending", title: t("Faltan") },
    { key: "expiry", title: t("Termina") },
    { key: "lend", title: t("Estatus") },
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

  return (
    <Main>
      <WrapperBig>
        <Title text={t("Solicitudes")} />
        <Table color="primary">
          <Rows className={customRows["flex1"]}>
            <Columns>
              {isBorrower ? <div style={{ width: 30 }} /> : null}
              {columns.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
            {data.myLoans &&
              data.myLoans.edges &&
              data.myLoans.edges.map((edge) => {
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
