import React, { FC } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { Transactions_user$key } from "./__generated__/Transactions_user.graphql";
import { TransactionsPaginationQuery } from "./__generated__/TransactionsPaginationQuery.graphql";
import { format } from "date-fns";
import es from "date-fns/locale/es";

const transactionsFragment = graphql`
  fragment Transactions_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 2 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "TransactionsPaginationQuery") {
    id
    transactions(first: $count, after: $cursor)
      @connection(key: "Transactions_user_transactions") {
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
  user: Transactions_user$key;
};

export const Transactions: FC<Props> = (props) => {
  const { data, loadNext } = usePaginationFragment<
    TransactionsPaginationQuery,
    Transactions_user$key
  >(transactionsFragment, props.user);

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
              edge.node.history.map((transaction) => {
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
    </div>
  );
};
