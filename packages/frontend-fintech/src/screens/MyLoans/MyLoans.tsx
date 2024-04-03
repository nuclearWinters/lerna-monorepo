import { FC, useMemo, useState } from "react";
import {
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
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import {
  myLoansFragment,
  myLoansPaginationFragment,
  subscriptionMyLoans,
} from "./MyLoansQueries";
import { utilsQuery } from "../../__generated__/utilsQuery.graphql";
import { RedirectContainer } from "../../components/RedirectContainer";
import { MyLoansQueriesPaginationUser } from "./__generated__/MyLoansQueriesPaginationUser.graphql";
import { MyLoansQueries_user$key } from "./__generated__/MyLoansQueries_user.graphql";
import { MyLoansQueriesQuery } from "./__generated__/MyLoansQueriesQuery.graphql";
import { MyLoansQueriesSubscription } from "./__generated__/MyLoansQueriesSubscription.graphql";

type Props = {
  query: PreloadedQuery<MyLoansQueriesQuery, {}>;
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

export const MyLoans: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(myLoansFragment, props.query);
  const { authUser } = usePreloadedQuery(authUserQuery, props.authQuery);
  const { data, loadNext, refetch } = usePaginationFragment<
    MyLoansQueriesPaginationUser,
    MyLoansQueries_user$key
  >(myLoansPaginationFragment, user);

  const connectionMyLoansID = ConnectionHandler.getConnectionID(
    user?.id || "",
    "MyLoans_user_myLoans",
    {}
  );

  const configMyLoans = useMemo<
    GraphQLSubscriptionConfig<MyLoansQueriesSubscription>
  >(
    () => ({
      variables: {
        connections: [connectionMyLoansID],
      },
      subscription: subscriptionMyLoans,
    }),
    [connectionMyLoansID]
  );
  useSubscription<MyLoansQueriesSubscription>(configMyLoans);

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

  if (!data?.myLoans) {
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

export default MyLoans;
