import React, { FC } from "react";
import { graphql, useRefetchableFragment } from "react-relay";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { InvestmentRowRefetchQuery } from "./__generated__/InvestmentRowRefetchQuery.graphql";
import { InvestmentRow_investment$key } from "./__generated__/InvestmentRow_investment.graphql";

const investmentRowRefetchableFragment = graphql`
  fragment InvestmentRow_investment on Investment
  @refetchable(queryName: "InvestmentRowRefetchQuery") {
    id
    _id_borrower
    _id_loan
    quantity
    created
    updated
    status
  }
`;

type Props = {
  investment: InvestmentRow_investment$key;
};

export const InvestmentRow: FC<Props> = ({ investment }) => {
  const [data, refetch] = useRefetchableFragment<
    InvestmentRowRefetchQuery,
    InvestmentRow_investment$key
  >(investmentRowRefetchableFragment, investment);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        height: 70,
        border: "1px solid black",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {data._id_borrower && (
          <div>
            Prestado a {data._id_borrower} con folio: {data._id_loan}
          </div>
        )}
        <div>Status: {data.status}</div>
        <div>
          Ultimo abono en:{" "}
          {format(data.updated, "d 'de' MMMM 'del' yyyy 'a las' HH:mm:ss", {
            locale: es,
          })}
        </div>
        <div>
          Prestamo creado en:{" "}
          {format(data.created, "d 'de' MMMM 'del' yyyy 'a las' HH:mm:ss", {
            locale: es,
          })}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>{data.quantity}</div>
        <button
          onClick={() => {
            refetch({}, { fetchPolicy: "network-only" });
          }}
        >
          Actualizar
        </button>
      </div>
    </div>
  );
};
