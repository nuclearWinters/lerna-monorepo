import React, { CSSProperties, FC, useState } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { DebtInSale_query$key } from "./__generated__/DebtInSale_query.graphql";
import { DebtInSalePaginationQuery } from "./__generated__/DebtInSalePaginationQuery.graphql";
import { commitAddLendsMutation } from "mutations/AddLends";
import { RelayEnvironment } from "RelayEnvironment";
import { useHistory } from "react-router";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { differenceInMonths, differenceInDays } from "date-fns";

const debtInSaleFragment = graphql`
  fragment DebtInSale_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "DebtInSalePaginationQuery") {
    loans(first: $count, after: $cursor)
      @connection(key: "DebtInSale_query_loans") {
      edges {
        node {
          id
          _id_user
          score
          ROI
          goal
          term
          raised
          expiry
        }
      }
    }
  }
`;

type Props = {
  user: {
    id: string;
  };
  data: AppQueryResponse;
};

export const DebtInSale: FC<Props> = (props) => {
  const history = useHistory();
  const { data, loadNext } = usePaginationFragment<
    DebtInSalePaginationQuery,
    DebtInSale_query$key
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
  ];

  const [lends, setLends] = useState<
    { loan_gid: string; quantity: string; borrower_id: string }[]
  >([]);

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
            data.loans.edges.map((edge) => (
              <div
                key={edge?.node?.id}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div style={style.cell}>{edge?.node?.id}</div>
                <div style={style.cell}>{edge?.node?._id_user}</div>
                <div style={style.cell}>{edge?.node?.score}</div>
                <div style={style.cell}>{edge?.node?.ROI}%</div>
                <div style={style.cell}>
                  ${((edge?.node?.goal || 0) / 100).toFixed(2)}
                </div>
                <div style={style.cell}>{edge?.node?.term} meses</div>
                <div style={style.cell}>
                  $
                  {(
                    ((edge?.node?.goal || 0) - (edge?.node?.raised || 0)) /
                    100
                  ).toFixed(2)}
                </div>
                <div style={style.cell}>
                  {differenceInMonths(
                    new Date(edge?.node?.expiry || new Date()),
                    new Date()
                  ) ??
                    differenceInDays(
                      new Date(edge?.node?.expiry || new Date()),
                      new Date()
                    )}{" "}
                  meses
                </div>
                <input
                  type="text"
                  name={edge?.node?.id}
                  style={style.cell}
                  value={getValue(edge?.node?.id)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isNaN(Number(val))) {
                      return;
                    }
                    setLends((state) => {
                      const idx = state.findIndex(
                        (lend) => edge?.node?.id === lend.loan_gid
                      );
                      if (Number(val) === 0) {
                        state.splice(idx, 1);
                        return [...state];
                      }
                      if (idx === -1) {
                        return [
                          ...state,
                          {
                            loan_gid: edge?.node?.id || "",
                            quantity: val,
                            borrower_id: edge?.node?._id_user || "",
                          },
                        ];
                      }
                      state[idx].quantity = val;
                      return [...state];
                    });
                  }}
                  onBlur={() => {
                    setLends((state) => {
                      const idx = state.findIndex(
                        (lend) => edge?.node?.id === lend.loan_gid
                      );
                      if (idx === -1) {
                        return state;
                      }
                      state[idx].quantity = Number(state[idx].quantity).toFixed(
                        2
                      );
                      return [...state];
                    });
                  }}
                />
              </div>
            ))}
        </div>
        <button onClick={() => loadNext(5)}>loadNext</button>
      </div>
      <div
        style={{
          width: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            if (props.user.id === "VXNlcjo=") {
              return history.push("/login");
            }
            commitAddLendsMutation(RelayEnvironment, {
              lends: lends.map((lend) => ({
                ...lend,
                quantity: Number(Number(lend.quantity).toFixed(2)) * 100,
              })),
              lender_gid: props.user.id,
              refreshToken:
                (RelayEnvironment.getStore()
                  .getSource()
                  .get("client:root:tokens")?.refreshToken as string) || "",
            });
            setLends([]);
          }}
        >
          Prestar
        </button>
      </div>
    </div>
  );
};

const style: Record<"cell", CSSProperties> = {
  cell: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    border: "1px solid black",
  },
};
