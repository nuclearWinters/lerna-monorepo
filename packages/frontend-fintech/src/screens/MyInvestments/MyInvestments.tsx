import { FC, useMemo, useState } from "react";
import {
  usePaginationFragment,
  usePreloadedQuery,
  PreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { InvestmentRow } from "../../components/InvestmentRow";
import { CustomButton } from "../../components/CustomButton";
import { Title } from "../../components/Title";
import { Main } from "../../components/Main";
import { WrapperBig } from "../../components/WrapperBig";
import { Select } from "../../components/Select";
import { Space, customSpace } from "../../components/Space";
import { Columns, baseColumn } from "../../components/Colums";
import { Table } from "../../components/Table";
import { Rows, baseRows } from "../../components/Rows";
import { TableColumnName } from "../../components/TableColumnName";
import { authUserQuery, useTranslation } from "../../utils";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { InvestmentStatus } from "../../components/__generated__/InvestmentRow_investment.graphql";
import {
  myInvestmentsFragment,
  myInvestmentsPaginationFragment,
  subscriptionInvestments,
  subscriptionInvestmentsUpdate,
} from "./MyInvestmentsQueries";
import { RedirectContainer } from "../../components/RedirectContainer";
import { MyInvestmentsQueriesSubscription } from "./__generated__/MyInvestmentsQueriesSubscription.graphql";
import { MyInvestmentsQueriesUpdateSubscription } from "./__generated__/MyInvestmentsQueriesUpdateSubscription.graphql";
import { MyInvestmentsQueriesPaginationUser } from "./__generated__/MyInvestmentsQueriesPaginationUser.graphql";
import { MyInvestmentsQueries_user$key } from "./__generated__/MyInvestmentsQueries_user.graphql";
import { MyInvestmentsQueriesQuery } from "./__generated__/MyInvestmentsQueriesQuery.graphql";
import { utilsQuery } from "../../__generated__/utilsQuery.graphql";

type Props = {
  query: PreloadedQuery<MyInvestmentsQueriesQuery, {}>;
  authQuery: PreloadedQuery<utilsQuery, {}>;
};

export const MyInvestments: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [reset, setReset] = useState(0);
  const { user } = usePreloadedQuery(myInvestmentsFragment, props.query);
  const { authUser } = usePreloadedQuery(authUserQuery, props.authQuery);
  const { data, loadNext, refetch } = usePaginationFragment<
    MyInvestmentsQueriesPaginationUser,
    MyInvestmentsQueries_user$key
  >(myInvestmentsPaginationFragment, user);

  const columns = [
    { key: "id", title: t("ID") },
    { key: "borrower_id", title: t("ID deudor") },
    { key: "loan_id", title: t("ID deuda") },
    { key: "quantity", title: t("Cantidad") },
    { key: "status", title: t("Estatus") },
    { key: "paid", title: t("Pagado") },
    { key: "owe", title: t("Adeudo") },
    { key: "interests", title: t("Intereses") },
    { key: "moratory", title: t("Interés por mora") },
    { key: "created", title: t("Creado en") },
    { key: "updated_at", title: t("Último cambio en") },
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
    user?.id || "",
    "MyInvestmentsQueries_user_investments",
    {
      status,
      reset,
    }
  );
  const configInvestments = useMemo<
    GraphQLSubscriptionConfig<MyInvestmentsQueriesSubscription>
  >(
    () => ({
      variables: {
        status,
        reset,
        connections: [connectionInvestmentID],
      },
      subscription: subscriptionInvestments,
    }),
    [status, connectionInvestmentID, reset]
  );
  const configInvestmentsUpdate = useMemo<
    GraphQLSubscriptionConfig<MyInvestmentsQueriesUpdateSubscription>
  >(
    () => ({
      variables: {},
      subscription: subscriptionInvestmentsUpdate,
    }),
    []
  );
  useSubscription<MyInvestmentsQueriesSubscription>(configInvestments);
  useSubscription<MyInvestmentsQueriesUpdateSubscription>(
    configInvestmentsUpdate
  );

  if (!user || !authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isSupport || isBorrower) {
    return (
      <RedirectContainer
        allowed={["lender"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

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
          <Rows styleX={[baseRows.base, baseRows.flex1]}>
            <Columns>
              {columns.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
            {data?.investments?.edges?.map((edge) => {
              if (edge?.node) {
                return (
                  <InvestmentRow key={edge.node.id} investment={edge.node} />
                );
              }
              return null;
            })}
          </Rows>
        </Table>
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
      </WrapperBig>
    </Main>
  );
};

export default MyInvestments;
