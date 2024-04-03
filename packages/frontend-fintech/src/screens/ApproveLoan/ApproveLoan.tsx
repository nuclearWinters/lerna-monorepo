import { FC, useMemo, useState } from "react";
import {
  ConnectionHandler,
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { LoanRow } from "../../components/LoanRow";
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
import {
  ApproveLoansQueriesPaginationFragment,
  approveLoansFragment,
  subscriptionApproveLoans,
} from "./ApproveLoanQueries";
import { utilsQuery } from "../../__generated__/utilsQuery.graphql";
import { RedirectContainer } from "../../components/RedirectContainer";
import { ApproveLoansQueriesPaginationUser } from "./__generated__/ApproveLoansQueriesPaginationUser.graphql";
import { ApproveLoanQueries_user$key } from "./__generated__/ApproveLoanQueries_user.graphql";
import { ApproveLoanQueriesQuery } from "./__generated__/ApproveLoanQueriesQuery.graphql";
import { ApproveLoanQueriesSubscription } from "./__generated__/ApproveLoanQueriesSubscription.graphql";
import { GraphQLSubscriptionConfig } from "relay-runtime";

type Props = {
  query: PreloadedQuery<ApproveLoanQueriesQuery, {}>;
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

export const ApproveLoans: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { authUser } = usePreloadedQuery(authUserQuery, props.authQuery);
  const { user } = usePreloadedQuery(approveLoansFragment, props.query);
  const { data, loadNext, refetch } = usePaginationFragment<
    ApproveLoansQueriesPaginationUser,
    ApproveLoanQueries_user$key
  >(ApproveLoansQueriesPaginationFragment, user);

  const connectionApproveLoansID = ConnectionHandler.getConnectionID(
    user?.id || "",
    "ApproveLoansQueries_user_approveLoans",
    {}
  );

  const configApproveLoans = useMemo<
    GraphQLSubscriptionConfig<ApproveLoanQueriesSubscription>
  >(
    () => ({
      variables: {
        connections: [connectionApproveLoansID],
      },
      subscription: subscriptionApproveLoans,
    }),
    [connectionApproveLoansID]
  );

  useSubscription<ApproveLoanQueriesSubscription>(configApproveLoans);

  const columns = [
    { key: "id", title: t("ID") },
    { key: "user_id", title: t("Solicitante") },
    { key: "score", title: t("Calif.") },
    { key: "ROI", title: t("Retorno anual") },
    { key: "goal", title: t("Monto") },
    { key: "term", title: t("Periodo") },
    { key: "pending", title: t("Faltan") },
    { key: "expiry", title: t("Termina") },
    { key: "lend", title: t("Estatus") },
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

  if (!authUser || !user) {
    return null;
  }

  if (!data?.approveLoans) {
    return <RedirectContainer />;
  }

  const { isLender, isSupport, isBorrower, language } = authUser;

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
            {data.approveLoans &&
              data.approveLoans.edges &&
              data.approveLoans.edges.map((edge) => {
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

export default ApproveLoans;
