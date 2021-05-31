import React, { FC } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { MyInvestments_query$key } from "./__generated__/MyInvestments_query.graphql";
import { MyInvestmentsPaginationQuery } from "./__generated__/MyInvestmentsPaginationQuery.graphql";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { tokensAndData } from "App";
import { InvestmentRow } from "../components/InvestmentRow";

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
          ...InvestmentRow_investment
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
            if (edge && edge.node) {
              return (
                <InvestmentRow key={edge.node.id} investment={edge.node} />
              );
            }
            return null;
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
