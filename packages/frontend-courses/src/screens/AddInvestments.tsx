import React, { CSSProperties, FC, useState } from "react";
import { graphql, useMutation, usePaginationFragment } from "react-relay";
import { AddInvestments_query$key } from "./__generated__/AddInvestments_query.graphql";
import { AddInvestmentsPaginationQuery } from "./__generated__/AddInvestmentsPaginationQuery.graphql";
import { useHistory } from "react-router";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { AddInvestmentsMutation } from "./__generated__/AddInvestmentsMutation.graphql";
import { getDataFromToken, tokensAndData } from "App";
import { LoanRow } from "components/LoanRow";
import { Spinner } from "components/Spinner";
import { CustomButton } from "components/CustomButton";

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
  }
`;

type Props = {
  user?: {
    id?: string;
  };
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
  const user_gid = props?.user?.id || "";
  const { isLender } = tokensAndData.data;
  const [commit, isInFlight] = useMutation<AddInvestmentsMutation>(graphql`
    mutation AddInvestmentsMutation($input: AddLendsInput!) {
      addLends(input: $input) {
        error
        validAccessToken
      }
    }
  `);
  const history = useHistory();
  const { data, loadNext } = usePaginationFragment<
    AddInvestmentsPaginationQuery,
    AddInvestments_query$key
  >(debtInSaleFragment, props.data);

  const columns = [
    { key: "id", title: "ID" },
    { key: "_id_user", title: "Solicitante" },
    { key: "score", title: "Calif." },
    { key: "ROI", title: "Retorno anual" },
    { key: "goal", title: "Monto" },
    { key: "term", title: "Periodo" },
    { key: "raised", title: "Faltan" },
    { key: "expiry", title: "Termina" },
    { key: "lend", title: "Prestar" },
    { key: "refetech", title: "Actualizar" },
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
    <div style={styles.main}>
      <div style={styles.wrapper}>
        <div style={styles.title}>Solicitudes</div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            margin: "10px 10px",
            backgroundColor: "rgba(255,90,96,0.1)",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "4px 0px",
                color: "rgb(62,62,62)",
              }}
            >
              {columns.map((column) => (
                <div key={column.key} style={{ flex: 1, textAlign: "center" }}>
                  {column.title}
                </div>
              ))}
            </div>
            <div>
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
                      />
                    );
                  }
                  return null;
                })}
            </div>
          </div>
          {isLender && (
            <div
              style={{
                width: 300,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {isInFlight ? (
                <Spinner />
              ) : (
                <div
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "16px",
                  }}
                >
                  <CustomButton
                    style={{ backgroundColor: "#1bbc9b", margin: "30px 0px" }}
                    text="Prestar"
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
                            return window.alert(response.addLends.error);
                          }
                          tokensAndData.tokens.accessToken =
                            response.addLends.validAccessToken;
                          const user = getDataFromToken(
                            response.addLends.validAccessToken
                          );
                          tokensAndData.data = user;
                        },
                      });
                      setLends([]);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <CustomButton
          text="Cargar más"
          style={{ margin: "20px 0px" }}
          onClick={() => loadNext(5)}
        />
      </div>
    </div>
  );
};

const styles: Record<"wrapper" | "main" | "title", CSSProperties> = {
  wrapper: {
    backgroundColor: "rgb(255,255,255)",
    margin: "30px 20px",
    borderRadius: 8,
    border: "1px solid rgb(203,203,203)",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  main: {
    backgroundColor: "rgb(248,248,248)",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    borderBottom: "1px solid rgb(203,203,203)",
    textAlign: "center",
    fontSize: 26,
    padding: "14px 0px",
  },
};
