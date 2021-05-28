import React, { FC, useMemo } from "react";
import {
  graphql,
  usePaginationFragment,
  useSubscription,
  ConnectionHandler,
} from "react-relay";
import { MyInvestments_query$key } from "./__generated__/MyInvestments_query.graphql";
import { MyInvestmentsPaginationQuery } from "./__generated__/MyInvestmentsPaginationQuery.graphql";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { MyInvestmentsSubscription } from "./__generated__/MyInvestmentsSubscription.graphql";
import { tokensAndData } from "App";

const myInvestmentsFragment = graphql`
  fragment MyInvestments_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 2 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "MyInvestmentsPaginationQuery") {
    investments(first: $count, after: $cursor, user_id: $id)
      @connection(key: "MyInvestments_query_investments") {
      edges {
        node {
          id
          _id_borrower
          _id_loan
          quantity
          created
          updated
          status
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
  subscription MyInvestmentsSubscription($user_gid: ID!) {
    investments_subscribe(user_gid: $user_gid) {
      investment_edge {
        node {
          id
          _id_borrower
          _id_lender
          _id_loan
          quantity
          created
          updated
          status
        }
        cursor
      }
      type
    }
  }
`;

export const MyInvestments: FC<Props> = (props) => {
  const user_gid = props?.user?.id || "";
  const config = useMemo<GraphQLSubscriptionConfig<MyInvestmentsSubscription>>(
    () => ({
      variables: { user_gid },
      subscription,
      updater: (store, data) => {
        if (data.investments_subscribe.type === "INSERT") {
          const root = store.getRoot();
          const connectionRecord = ConnectionHandler.getConnection(
            root,
            "MyInvestments_query_investments",
            {
              user_id: tokensAndData.data._id,
            }
          );
          if (!connectionRecord) {
            throw new Error("no existe el connectionRecord");
          }
          const payload = store.getRootField("investments_subscribe");
          const serverEdge = payload?.getLinkedRecord("investment_edge");
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
    [user_gid]
  );
  useSubscription(config);
  const { data, loadNext, refetch } = usePaginationFragment<
    MyInvestmentsPaginationQuery,
    MyInvestments_query$key
  >(myInvestmentsFragment, props.data);

  return (
    <div>
      <div>Mis inversiones</div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}>
        {data.investments &&
          data.investments.edges &&
          data.investments.edges.map((edge) => {
            return (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "row",
                  height: 70,
                  border: "1px solid black",
                }}
                key={edge?.node?.id}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {edge?.node?._id_borrower && (
                    <div>
                      Prestado a {edge?.node?._id_borrower} con folio:{" "}
                      {edge?.node?._id_loan}
                    </div>
                  )}
                  <div>Status: {edge?.node?.status}</div>
                  <div>
                    Ultimo abono en:{" "}
                    {format(
                      edge?.node?.updated || new Date(),
                      "d 'de' MMMM 'del' yyyy 'a las' HH:mm:ss",
                      { locale: es }
                    )}
                  </div>
                  <div>
                    Prestamo creado en:{" "}
                    {format(
                      edge?.node?.created || new Date(),
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
                  {edge?.node?.quantity}
                </div>
              </div>
            );
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
