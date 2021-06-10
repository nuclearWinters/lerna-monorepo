import React, { FC, useEffect } from "react";
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
    status: {
      type: "[InvestmentStatus!]!"
      defaultValue: [DELAY_PAYMENT, UP_TO_DATE]
    }
  )
  @refetchable(queryName: "MyInvestmentsPaginationQuery") {
    investments(first: $count, after: $cursor, user_id: $id, status: $status)
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
  setInvestmentStatus: React.Dispatch<
    React.SetStateAction<"on_going" | "over">
  >;
  investmentStatus: "on_going" | "over";
};

export const MyInvestments: FC<Props> = (props) => {
  const { data, loadNext, refetch } = usePaginationFragment<
    MyInvestmentsPaginationQuery,
    MyInvestments_query$key
  >(myInvestmentsFragment, props.data);

  const columns = [
    { key: "id", title: "ID" },
    { key: "_id_borrower", title: "Prestado a" },
    { key: "_id_loan", title: "ID Deuda" },
    { key: "quantity", title: "Cantidad" },
    { key: "status", title: "Estatus" },
    { key: "paid", title: "Pagado" },
    { key: "owe", title: "Adeudo" },
    { key: "interests", title: "Intereses" },
    { key: "moratory", title: "Interés por mora" },
    { key: "created", title: "Creado en:" },
    { key: "updated", title: "Último cambio en:" },
    { key: "refetch", title: "Actualizar" },
  ];

  const handleInvestmentStatusOnChange = () => {
    props.setInvestmentStatus((state) => {
      return state === "on_going" ? "over" : "on_going";
    });
  };

  useEffect(() => {
    refetch(
      {
        id: tokensAndData.data._id,
        status:
          props.investmentStatus === "on_going"
            ? ["DELAY_PAYMENT", "UP_TO_DATE", "FINANCING"]
            : ["PAID", "PAST_DUE"],
      },
      { fetchPolicy: "network-only" }
    );
  }, [props.investmentStatus, refetch]);

  return (
    <div>
      <div>Mis inversiones</div>
      <select
        value={props.investmentStatus}
        onChange={handleInvestmentStatusOnChange}
      >
        <option value="on_going">En curso</option>
        <option value="over">Terminados</option>
      </select>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {columns.map((column) => (
            <div key={column.key} style={{ flex: 1 }}>
              {column.title}
            </div>
          ))}
        </div>
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
