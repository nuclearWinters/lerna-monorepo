import React, { FC, useState } from "react";
import { graphql, useMutation, usePaginationFragment } from "react-relay";
import { AddInvestments_query$key } from "./__generated__/AddInvestments_query.graphql";
import { AddInvestmentsPaginationQuery } from "./__generated__/AddInvestmentsPaginationQuery.graphql";
import { useHistory } from "react-router";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { AddInvestmentsMutation } from "./__generated__/AddInvestmentsMutation.graphql";
import { getDataFromToken, tokensAndData } from "App";
import { LoanRow } from "components/LoanRow";
import { Spinner } from "components/Spinner";

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
      status: $status
      borrower_id: $borrower_id
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
    <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {columns.map((column) => (
            <div key={column.key} style={{ flex: 1 }}>
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
        <button onClick={() => loadNext(5)}>loadNext</button>
      </div>
      {isLender && (
        <div
          style={{
            width: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isInFlight ? (
            <Spinner />
          ) : (
            <button
              onClick={() => {
                if (user_gid === "VXNlcjowMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=") {
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
                      throw new Error(response.addLends.error);
                    }
                  },
                  updater: (store, data) => {
                    tokensAndData.tokens.accessToken =
                      data.addLends.validAccessToken;
                    const user = getDataFromToken(
                      data.addLends.validAccessToken
                    );
                    tokensAndData.data = user;
                  },
                  onError: (error) => {
                    window.alert(error.message);
                  },
                });
                setLends([]);
              }}
            >
              Prestar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
