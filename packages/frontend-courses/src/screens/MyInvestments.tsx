import React, { FC } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { MyInvestments_query$key } from "./__generated__/MyInvestments_query.graphql";
import { MyInvestmentsPaginationQuery } from "./__generated__/MyInvestmentsPaginationQuery.graphql";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
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
  data: AppQueryResponse;
};

export const MyInvestments: FC<Props> = (props) => {
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
