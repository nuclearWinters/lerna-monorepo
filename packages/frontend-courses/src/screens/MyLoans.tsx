import React, { FC, useState } from "react";
import { graphql, useFragment, usePaginationFragment } from "react-relay";
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
import { MyLoans_auth_user$key } from "./__generated__/MyLoans_auth_user.graphql";
import { MyLoansPaginationUser } from "./__generated__/MyLoansPaginationUser.graphql";
import { useTranslation } from "utils";

const debtInSaleFragment = graphql`
  fragment MyLoans_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
    firstFetch: { type: "Boolean", defaultValue: true }
  )
  @refetchable(queryName: "MyLoansPaginationUser") {
    myLoans(first: $count, after: $cursor, firstFetch: $firstFetch)
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

const debtInSaleFragmentAuthUser = graphql`
  fragment MyLoans_auth_user on AuthUser {
    isLender
    isSupport
    isBorrower
    language
    accountId
  }
`;

type Props = {
  user: MyLoans_user$key;
  authUser: MyLoans_auth_user$key;
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
  const { data, loadNext, refetch } = usePaginationFragment<
    MyLoansPaginationUser,
    MyLoans_user$key
  >(debtInSaleFragment, props.user);

  const authUser = useFragment<MyLoans_auth_user$key>(
    debtInSaleFragmentAuthUser,
    props.authUser
  );

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
          <Rows style={{ flex: 1 }}>
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
        <Space h={20} />
        <Columns
          style={{
            justifyContent: "center",
          }}
        >
          <CustomButton
            color="secondary"
            text={t("Cargar más")}
            onClick={() => loadNext(5)}
          />
          <Space w={20} />
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
        <Space h={20} />
      </WrapperBig>
    </Main>
  );
};
