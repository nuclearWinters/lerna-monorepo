import { FC, useMemo, useState } from "react";
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
import { LoanRow } from "../../components/LoanRow";
import { Spinner } from "../../components/Spinner";
import { CustomButton } from "../../components/CustomButton";
import { Main } from "../../components/Main";
import { Title } from "../../components/Title";
import { WrapperBig } from "../../components/WrapperBig";
import { Rows, baseRows } from "../../components/Rows";
import { Space, customSpace } from "../../components/Space";
import { Columns, baseColumn } from "../../components/Colums";
import { TableColumnName } from "../../components/TableColumnName";
import { Table } from "../../components/Table";
import { authUserQuery, useTranslation } from "../../utils";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { useNavigate } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";
import {
  addInvestmentFragment,
  addInvestmentPaginationFragment,
  subscriptionLoans,
} from "./AddInvestmentsQueries";
import { utilsQuery } from "../../__generated__/utilsQuery.graphql";
import { RedirectContainer } from "../../components/RedirectContainer";
import { AddInvestmentsQueriesQuery } from "./__generated__/AddInvestmentsQueriesQuery.graphql";
import { AddInvestmentsQueriesPaginationQuery } from "./__generated__/AddInvestmentsQueriesPaginationQuery.graphql";
import { AddInvestmentsQueries_user$key } from "./__generated__/AddInvestmentsQueries_user.graphql";
import { AddInvestmentsQueriesLoansSubscription } from "./__generated__/AddInvestmentsQueriesLoansSubscription.graphql";

export const baseAddInvestmentsTotal = stylex.create({
  base: {
    marginTop: "14px",
    fontWeight: "bold",
  },
});

export const basePrestarWrapper = stylex.create({
  base: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "16px",
    padding: "30px 0px",
  },
});

type Props = {
  query: PreloadedQuery<AddInvestmentsQueriesQuery, {}>;
  authQuery: PreloadedQuery<utilsQuery, {}>;
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
  const { user, __id } = usePreloadedQuery(addInvestmentFragment, props.query);
  const { authUser } = usePreloadedQuery(authUserQuery, props.authQuery);
  const id = authUser?.id;
  const [commit, isInFlight] = useMutation<AddInvestmentsMutation>(graphql`
    mutation AddInvestmentsMutation($input: AddLendsInput!) {
      addLends(input: $input) {
        error
      }
    }
  `);
  const navigate = useNavigate();
  const { data, loadNext, refetch } = usePaginationFragment<
    AddInvestmentsQueriesPaginationQuery,
    AddInvestmentsQueries_user$key
  >(addInvestmentPaginationFragment, user);

  const columns = [
    { key: "id", title: t("ID") },
    { key: "user_id", title: t("Solicitante") },
    { key: "score", title: t("Calif.") },
    { key: "ROI", title: t("Retorno anual") },
    { key: "goal", title: t("Monto") },
    { key: "term", title: t("Periodo") },
    { key: "pending", title: t("Faltan") },
    { key: "expiry", title: t("Termina") },
    { key: "lend", title: t("Prestar") },
    { key: "refetch", title: t("Refrescar") },
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
    __id,
    "AddInvestments_query_loansFinancing",
    {}
  );
  const configLoans = useMemo<
    GraphQLSubscriptionConfig<AddInvestmentsQueriesLoansSubscription>
  >(
    () => ({
      variables: {
        connections: [connectionLoanID],
      },
      subscription: subscriptionLoans,
    }),
    [connectionLoanID]
  );
  useSubscription<AddInvestmentsQueriesLoansSubscription>(configLoans);

  if (!authUser || !user) {
    return null;
  }

  const { isLender, isSupport, isBorrower, language } = authUser;

  if (isBorrower || isSupport) {
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
        <Title text={t("Solicitudes")} />
        <Table color="primary">
          <Rows styleX={[baseRows.base, baseRows.flex1]}>
            <Columns>
              {isBorrower ? <Space styleX={customSpace.w30} /> : null}
              {columns.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
            {data?.loansFinancing?.edges?.map((edge) => {
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
            <Rows styleX={[baseRows.base, baseRows.lender]}>
              {isInFlight ? (
                <Spinner />
              ) : (
                <div {...stylex.props(basePrestarWrapper.base)}>
                  <Space styleX={customSpace.h30} />
                  <CustomButton
                    text={t("Prestar")}
                    onClick={() => {
                      if (id === "QXV0aFVzZXI6") {
                        return navigate("/login");
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
                      });
                      setLends([]);
                    }}
                  />
                  <div {...stylex.props(baseAddInvestmentsTotal.base)}>
                    {t("Total")}
                    {`: $${total}`}
                  </div>
                  <div {...stylex.props(baseAddInvestmentsTotal.base)}>
                    {t("Inversiones")}: {lends.length}
                  </div>
                  <Space styleX={customSpace.h30} />
                </div>
              )}
            </Rows>
          )}
        </Table>
        <Space styleX={customSpace.h20} />
        <Columns styleX={[baseColumn.base, baseColumn.columnJustifyCenter]}>
          <CustomButton
            color="secondary"
            text={t("Cargar más")}
            onClick={() => loadNext(5)}
          />
          <Space styleX={customSpace.w20} />
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
        <Space styleX={customSpace.h20} />
      </WrapperBig>
    </Main>
  );
};

export default AddInvestments;
