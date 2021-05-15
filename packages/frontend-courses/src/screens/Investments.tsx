import React, { FC } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { Investments_query$key } from "./__generated__/Investments_query.graphql";
import { InvestmentsPaginationQuery } from "./__generated__/InvestmentsPaginationQuery.graphql";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";

const investmentsFragment = graphql`
  fragment Investments_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 2 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "InvestmentsPaginationQuery") {
    investments(
      first: $count
      after: $cursor
      refreshToken: $refreshToken
      user_id: $id
    ) @connection(key: "Investments_query_investments") {
      edges {
        node {
          id
          _id_borrower
          _id_loan
          quantity
          created
          updated
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

export const Investments: FC<Props> = (props) => {
  const { data, loadNext } = usePaginationFragment<
    InvestmentsPaginationQuery,
    Investments_query$key
  >(investmentsFragment, props.data);

  return (
    <div>
      <div>Mis movimientos</div>
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
    </div>
  );
};
