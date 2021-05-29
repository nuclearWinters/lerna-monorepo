import React, { FC } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { MyTransactions_query$key } from "./__generated__/MyTransactions_query.graphql";
import { MyTransactionsPaginationQuery } from "./__generated__/MyTransactionsPaginationQuery.graphql";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { tokensAndData } from "App";

const transactionsFragment = graphql`
  fragment MyTransactions_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 2 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "MyTransactionsPaginationQuery") {
    transactions(first: $count, after: $cursor, user_id: $id)
      @connection(key: "MyTransactions_query_transactions") {
      edges {
        node {
          id
          count
          history {
            id
            _id_borrower
            _id_loan
            type
            quantity
            created
          }
        }
      }
    }
  }
`;

type Props = {
  data: AppQueryResponse;
};

export const MyTransactions: FC<Props> = (props) => {
  const { data, loadNext, refetch } = usePaginationFragment<
    MyTransactionsPaginationQuery,
    MyTransactions_query$key
  >(transactionsFragment, props.data);

  return (
    <div>
      <div>Mis movimientos</div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 400 }}>
        {data.transactions &&
          data.transactions.edges &&
          data.transactions.edges.map((edge) => {
            const history =
              edge &&
              edge.node &&
              edge.node.history &&
              [...edge.node.history].reverse().map((transaction) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      height: 70,
                      border: "1px solid black",
                    }}
                    key={transaction.id}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <div>
                        {transaction.type === "CREDIT"
                          ? "Ingreso"
                          : transaction.type === "WITHDRAWAL"
                          ? "Retiro"
                          : "Inversión"}
                      </div>
                      {transaction._id_borrower && (
                        <div>
                          Prestado a {transaction._id_borrower} con folio:{" "}
                          {transaction._id_loan}
                        </div>
                      )}
                      <div>
                        {format(
                          transaction.created || new Date(),
                          "d 'de' MMMM 'del' yyyy 'a las' HH:mm:ss",
                          { locale: es }
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {transaction.quantity}
                    </div>
                  </div>
                );
              });
            return <div key={edge?.node?.id}>{history}</div>;
          })}
      </div>
      <button onClick={() => loadNext(1)}>loadNext</button>
      <button
        onClick={() =>
          refetch(
            {
              id: tokensAndData.data._id,
            },
            { fetchPolicy: "network-only" }
          )
        }
      >
        refetch
      </button>
    </div>
  );
};
