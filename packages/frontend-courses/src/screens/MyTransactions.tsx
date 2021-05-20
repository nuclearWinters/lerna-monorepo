import React, { FC, useMemo } from "react";
import {
  graphql,
  usePaginationFragment,
  useRelayEnvironment,
  useSubscription,
} from "react-relay";
import { MyTransactions_query$key } from "./__generated__/MyTransactions_query.graphql";
import { MyTransactionsPaginationQuery } from "./__generated__/MyTransactionsPaginationQuery.graphql";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { MyTransactionsSubscription } from "./__generated__/MyTransactionsSubscription.graphql";
import { getIdFromToken, getRefreshToken } from "App";

const transactionsFragment = graphql`
  fragment MyTransactions_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 2 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "MyTransactionsPaginationQuery") {
    transactions(
      first: $count
      after: $cursor
      refreshToken: $refreshToken
      user_id: $id
    ) @connection(key: "MyTransactions_query_transactions") {
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
  user: {
    id: string;
  };
  data: AppQueryResponse;
};

const subscription = graphql`
  subscription MyTransactionsSubscription($user_gid: ID!) {
    transactions_subscribe(user_gid: $user_gid) {
      transaction_edge {
        node {
          id
          _id_user
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
        cursor
      }
      type
    }
  }
`;

export const MyTransactions: FC<Props> = (props) => {
  const environment = useRelayEnvironment();
  const user_gid = props?.user?.id || "";
  const config = useMemo<GraphQLSubscriptionConfig<MyTransactionsSubscription>>(
    () => ({
      variables: { user_gid },
      subscription,
      updater: (store, data) => {
        if (data.transactions_subscribe.type === "INSERT") {
          const root = store.getRoot();
          const connectionRecord = ConnectionHandler.getConnection(
            root,
            "MyTransactions_query_transactions",
            {
              refreshToken: getRefreshToken(environment),
              user_id: getIdFromToken(environment),
            }
          );
          if (!connectionRecord) {
            throw new Error("no existe el connectionRecord");
          }
          const payload = store.getRootField("transactions_subscribe");
          const serverEdge = payload?.getLinkedRecord("transaction_edge");
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
    [user_gid, environment]
  );
  useSubscription(config);
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
              refreshToken: getRefreshToken(environment),
              id: getIdFromToken(environment),
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
