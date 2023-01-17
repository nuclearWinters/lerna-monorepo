import React, { FC, useMemo, useState } from "react";
import {
  graphql,
  usePaginationFragment,
  usePreloadedQuery,
  PreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { InvestmentRow } from "../components/InvestmentRow";
import { CustomButton } from "components/CustomButton";
import { Title } from "components/Title";
import { Main } from "components/Main";
import { WrapperBig } from "components/WrapperBig";
import { Select } from "components/Select";
import { Space } from "components/Space";
import { Columns } from "components/Colums";
import { Table } from "components/Table";
import { Rows } from "components/Rows";
import { TableColumnName } from "components/TableColumnName";
import { MyInvestmentsPaginationUser } from "./__generated__/MyInvestmentsPaginationUser.graphql";
import { MyInvestments_user$key } from "./__generated__/MyInvestments_user.graphql";
import { useTranslation } from "utils";
import { MyInvestmentsUserQuery } from "./__generated__/MyInvestmentsUserQuery.graphql";
import { customColumn } from "components/Column.css";
import { customRows } from "components/Rows.css";
import { customSpace } from "components/Space.css";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { MyInvestmentsInvestmentsSubscription } from "./__generated__/MyInvestmentsInvestmentsSubscription.graphql";
import { MyInvestmentsInvestmentsUpdateSubscription } from "./__generated__/MyInvestmentsInvestmentsUpdateSubscription.graphql";
import { InvestmentStatus } from "__generated__/Routes_user.graphql";

const subscriptionInvestments = graphql`
  subscription MyInvestmentsInvestmentsSubscription(
    $connections: [ID!]!
    $status: [InvestmentStatus!]
  ) {
    investments_subscribe_insert(status: $status)
      @prependEdge(connections: $connections) {
      node {
        id
        id_borrower
        id_lender
        _id_loan
        quantity
        ROI
        payments
        term
        moratory
        created
        updated
        status
        interest_to_earn
        paid_already
        to_be_paid
      }
      cursor
    }
  }
`;

const subscriptionInvestmentsUpdate = graphql`
  subscription MyInvestmentsInvestmentsUpdateSubscription {
    investments_subscribe_update {
      id
      id_borrower
      id_lender
      _id_loan
      quantity
      ROI
      payments
      term
      moratory
      created
      updated
      status
      interest_to_earn
      paid_already
      to_be_paid
    }
  }
`;

const myInvestmentsFragment = graphql`
  query MyInvestmentsUserQuery {
    user {
      id
      ...MyInvestments_user
    }
  }
`;

const myInvestmentsPaginationFragment = graphql`
  fragment MyInvestments_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
    status: { type: "[InvestmentStatus!]", defaultValue: null }
  )
  @refetchable(queryName: "MyInvestmentsPaginationUser") {
    investments(first: $count, after: $cursor, status: $status)
      @connection(key: "MyInvestments_user_investments") {
      edges {
        node {
          id
          ...InvestmentRow_investment
        }
      }
    }
  }
`;

type Props = {
  preloaded: {
    id?: string;
    query: PreloadedQuery<MyInvestmentsUserQuery, {}>;
  };
};

export const MyInvestments: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(
    myInvestmentsFragment,
    props.preloaded.query
  );
  const { data, loadNext, refetch } = usePaginationFragment<
    MyInvestmentsPaginationUser,
    MyInvestments_user$key
  >(myInvestmentsPaginationFragment, user);

  const columns = [
    { key: "id", title: t("ID") },
    { key: "id_borrower", title: t("ID deudor") },
    { key: "_id_loan", title: t("ID deuda") },
    { key: "quantity", title: t("Cantidad") },
    { key: "status", title: t("Estatus") },
    { key: "paid", title: t("Pagado") },
    { key: "owe", title: t("Adeudo") },
    { key: "interests", title: t("Intereses") },
    { key: "moratory", title: t("Interés por mora") },
    { key: "created", title: t("Creado en") },
    { key: "updated", title: t("Último cambio en") },
    { key: "refetch", title: t("Refrescar") },
  ];

  const [investmentStatus, setInvestmentStatus] = useState<
    "none" | "on_going" | "over"
  >("none");

  const status: InvestmentStatus[] | null = useMemo(() => {
    return investmentStatus === "on_going"
      ? ["DELAY_PAYMENT", "UP_TO_DATE", "FINANCING"]
      : investmentStatus === "over"
      ? ["PAID", "PAST_DUE"]
      : null;
  }, [investmentStatus]);

  const connectionInvestmentID = ConnectionHandler.getConnectionID(
    user.id,
    "MyInvestments_user_investments",
    {
      status,
    }
  );
  const configInvestments = useMemo<
    GraphQLSubscriptionConfig<MyInvestmentsInvestmentsSubscription>
  >(
    () => ({
      variables: {
        status,
        connections: [connectionInvestmentID],
      },
      subscription: subscriptionInvestments,
    }),
    [status, connectionInvestmentID]
  );
  const configInvestmentsUpdate = useMemo<
    GraphQLSubscriptionConfig<MyInvestmentsInvestmentsUpdateSubscription>
  >(
    () => ({
      variables: {},
      subscription: subscriptionInvestmentsUpdate,
    }),
    []
  );
  useSubscription<MyInvestmentsInvestmentsSubscription>(configInvestments);
  useSubscription<MyInvestmentsInvestmentsUpdateSubscription>(
    configInvestmentsUpdate
  );

  return (
    <Main>
      <WrapperBig>
        <Title text={t("Mis inversiones")} />
        <Select
          value={investmentStatus}
          onChange={(e) => {
            const investmentStatus = e.target.value as
              | "on_going"
              | "over"
              | "none";
            setInvestmentStatus(investmentStatus);
            const status: InvestmentStatus[] | null =
              investmentStatus === "on_going"
                ? ["DELAY_PAYMENT", "UP_TO_DATE", "FINANCING"]
                : investmentStatus === "over"
                ? ["PAID", "PAST_DUE"]
                : null;
            refetch(
              {
                status,
              },
              { fetchPolicy: "network-only" }
            );
          }}
          options={[
            {
              value: "on_going",
              label: t("En curso"),
            },
            {
              value: "over",
              label: t("Terminados"),
            },
            {
              value: "none",
              label: t("Selecciona..."),
            },
          ]}
        />
        <Table color="secondary">
          <Rows className={customRows["flex1"]}>
            <Columns>
              {columns.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
            {data.investments &&
              data.investments.edges &&
              data.investments.edges.map((edge) => {
                if (edge && edge.node) {
                  return (
                    <InvestmentRow key={edge.node.id} investment={edge.node} />
                  );
                }
                return null;
              })}
          </Rows>
        </Table>
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
      </WrapperBig>
    </Main>
  );
};
