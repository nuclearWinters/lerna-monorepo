import React, { CSSProperties, FC, useMemo, useState } from "react";
import {
  graphql,
  useMutation,
  usePaginationFragment,
  useSubscription,
} from "react-relay";
import { AddInvestments_query$key } from "./__generated__/AddInvestments_query.graphql";
import { AddInvestmentsPaginationQuery } from "./__generated__/AddInvestmentsPaginationQuery.graphql";
import { useHistory } from "react-router";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { differenceInMonths, differenceInDays } from "date-fns";
import { AddInvestmentsMutation } from "./__generated__/AddInvestmentsMutation.graphql";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { AddInvestmentsSubscription } from "./__generated__/AddInvestmentsSubscription.graphql";
import { ConnectionHandler } from "relay-runtime";
import { getDataFromToken, tokensAndData } from "App";
import { AddInvestmentsApproveLoanMutation } from "./__generated__/AddInvestmentsApproveLoanMutation.graphql";

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
          _id_user
          score
          ROI
          goal
          term
          raised
          expiry
          status
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

const subscription = graphql`
  subscription AddInvestmentsSubscription {
    loans_subscribe {
      loan_edge {
        node {
          id
          _id_user
          score
          ROI
          goal
          term
          raised
          expiry
          status
        }
        cursor
      }
      type
    }
  }
`;

export const AddInvestments: FC<Props> = (props) => {
  const user_gid = props?.user?.id || "";
  const { isLender, isSupport } = tokensAndData.data;
  const config = useMemo<GraphQLSubscriptionConfig<AddInvestmentsSubscription>>(
    () => ({
      variables: {},
      subscription,
      updater: (store, data) => {
        if (data.loans_subscribe.type === "INSERT") {
          const root = store.getRoot();
          const connectionRecord = ConnectionHandler.getConnection(
            root,
            "AddInvestments_query_loans"
          );
          if (!connectionRecord) {
            throw new Error("no existe el connectionRecord");
          }
          const payload = store.getRootField("loans_subscribe");
          const serverEdge = payload?.getLinkedRecord("loan_edge");
          const newEdge = ConnectionHandler.buildConnectionEdge(
            store,
            connectionRecord,
            serverEdge
          );
          if (!newEdge) {
            throw new Error("no existe el newEdge");
          }
          ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
        }
      },
    }),
    []
  );
  const [commitApproveLoan] =
    useMutation<AddInvestmentsApproveLoanMutation>(graphql`
      mutation AddInvestmentsApproveLoanMutation($input: ApproveLoanInput!) {
        approveLoan(input: $input) {
          error
          validAccessToken
        }
      }
    `);
  useSubscription<AddInvestmentsSubscription>(config);
  const [commit] = useMutation<AddInvestmentsMutation>(graphql`
    mutation AddInvestmentsMutation($input: AddLendsInput!) {
      addLends(input: $input) {
        error
        validAccessToken
        user {
          accountAvailable
        }
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
                <div style={style.cell}>${edge?.node?.goal}</div>
                <div style={style.cell}>{edge?.node?.term} meses</div>
                <div style={style.cell}>
                  $
                  {(
                    Number(edge?.node?.goal || 0) -
                    Number(edge?.node?.raised || 0)
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
                {isLender ? (
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
                        state[idx].quantity = Number(
                          state[idx].quantity
                        ).toFixed(2);
                        return [...state];
                      });
                    }}
                  />
                ) : isSupport &&
                  edge?.node?.status === "WAITING_FOR_APPROVAL" ? (
                  <div style={style.cell}>
                    <button
                      onClick={() => {
                        commitApproveLoan({
                          variables: {
                            input: {
                              loan_gid: edge?.node?.id || "",
                            },
                          },
                          onCompleted: (response) => {
                            if (response.approveLoan.error) {
                              throw new Error(response.approveLoan.error);
                            }
                          },
                          updater: (store, data) => {
                            tokensAndData.tokens.accessToken =
                              data.approveLoan.validAccessToken;
                            const user = getDataFromToken(
                              data.approveLoan.validAccessToken
                            );
                            tokensAndData.data = user;
                          },
                          onError: (error) => {
                            window.alert(error.message);
                          },
                        });
                      }}
                    >
                      Aprobar
                    </button>
                  </div>
                ) : (
                  <div style={style.cell}>{edge?.node?.status}</div>
                )}
              </div>
            ))}
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
          <button
            onClick={() => {
              if (user_gid === "VXNlcjo=") {
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
                  const user = getDataFromToken(data.addLends.validAccessToken);
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
        </div>
      )}
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
