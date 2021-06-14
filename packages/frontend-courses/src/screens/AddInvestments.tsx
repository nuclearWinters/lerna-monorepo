import React, { CSSProperties, FC, useState } from "react";
import { graphql, useMutation, usePaginationFragment } from "react-relay";
import { AddInvestments_query$key } from "./__generated__/AddInvestments_query.graphql";
import { AddInvestmentsPaginationQuery } from "./__generated__/AddInvestmentsPaginationQuery.graphql";
import { useHistory } from "react-router";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
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
import { generateCurrency, logOut } from "utils";
import { useTranslation } from "react-i18next";

const debtInSaleFragment = graphql`
  fragment AddInvestments_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "AddInvestmentsPaginationQuery") {
    loans(
      first: $count
      after: $cursor
      borrower_id: $borrower_id
      status: $status
    ) @connection(key: "AddInvestments_query_loans") {
      edges {
        node {
          id
          ...LoanRow_loan
        }
      }
    }
    user(id: $id) {
      id
    }
    authUser(id: $id) {
      isLender
      isSupport
    }
  }
`;

type Props = {
  data: AppQueryResponse;
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
  const [commit, isInFlight] = useMutation<AddInvestmentsMutation>(graphql`
    mutation AddInvestmentsMutation($input: AddLendsInput!) {
      addLends(input: $input) {
        error
        validAccessToken
      }
    }
  `);
  const history = useHistory();
  const { data, loadNext, refetch } = usePaginationFragment<
    AddInvestmentsPaginationQuery,
    AddInvestments_query$key
  >(debtInSaleFragment, props.data);

  const user_gid = data.user.id;
  const { isLender, isSupport } = data.authUser;

  const columns = [
    { key: "id", title: t("ID") },
    { key: "_id_user", title: t("Solicitante") },
    { key: "score", title: t("Calif.") },
    { key: "ROI", title: t("Retorno anual") },
    { key: "goal", title: t("Monto") },
    { key: "term", title: t("Periodo") },
    { key: "raised", title: t("Faltan") },
    { key: "expiry", title: t("Termina") },
    {
      key: "lend",
      title: isLender ? t("Prestar") : t("Estatus"),
    },
    { key: "refetech", title: t("Refrescar") },
  ];

  const [lends, setLends] = useState<ILends[]>([]);

  const getValue = (id: string | undefined) => {
    if (!id) {
      return "";
    }
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
              {columns.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
            {data.loans &&
              data.loans.edges &&
              data.loans.edges.map((edge) => {
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
                    />
                  );
                }
                return null;
              })}
          </Rows>
          {isLender && (
            <Rows style={{ width: 300 }}>
              {isInFlight ? (
                <Spinner />
              ) : (
                <div style={styles.prestarWrapper}>
                  <Space h={30} />
                  <CustomButton
                    text={t("Prestar")}
                    onClick={() => {
                      if (
                        user_gid === "VXNlcjowMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA="
                      ) {
                        return history.push("/login");
                      }
                      commit({
                        variables: {
                          input: {
                            lends: lends.map((lend) => ({
                              ...lend,
                              quantity: lend.quantity,
                            })),
                            lender_gid: user_gid,
                          },
                        },
                        onCompleted: (response) => {
                          if (response.addLends.error) {
                            if (response.addLends.error === "jwt expired") {
                              logOut();
                            }
                            return window.alert(response.addLends.error);
                          }
                          tokensAndData.tokens.accessToken =
                            response.addLends.validAccessToken;
                        },
                      });
                      setLends([]);
                    }}
                  />
                  <div style={{ marginTop: 14, fontWeight: "bold" }}>
                    {t("Total")}:{" "}
                    {generateCurrency(
                      lends.reduce((acc, item) => {
                        return acc + Number(item.quantity) * 100;
                      }, 0)
                    )}
                  </div>
                  <div style={{ marginTop: 14, fontWeight: "bold" }}>
                    {t("Inversiones")}: {lends.length}
                  </div>
                  <Space h={30} />
                </div>
              )}
            </Rows>
          )}
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
