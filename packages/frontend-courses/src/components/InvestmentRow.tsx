import React, { CSSProperties, FC } from "react";
import { graphql, useRefetchableFragment } from "react-relay";
import { InvestmentRowRefetchQuery } from "./__generated__/InvestmentRowRefetchQuery.graphql";
import { InvestmentRow_investment$key } from "./__generated__/InvestmentRow_investment.graphql";
import { format } from "date-fns";

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
    payments
    ROI
    term
    moratory
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
  const { ROI, term, payments, quantity } = data;
  const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
  const amortize = Math.floor(
    quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
  );
  const paid = ((amortize * payments) / 100).toFixed(2);
  const owes = ((amortize * (term - payments)) / 100).toFixed(2);
  const interests = ((amortize * term - quantity) / 100).toFixed(2);
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={style.cell}>{data.id}</div>
      <div style={style.cell}>{data._id_borrower}</div>
      <div style={style.cell}>{data._id_loan}</div>
      <div style={style.cell}>${(data.quantity / 100).toFixed(2)}</div>
      <div style={style.cell}>{data.status}</div>
      <div style={style.cell}>${paid}</div>
      <div style={style.cell}>${owes}</div>
      <div style={style.cell}>${interests}</div>
      <div style={style.cell}>${data.moratory}</div>
      <div style={style.cell}>
        {format(data.updated, "dd/mm/yyyy HH:mm:ss")}
      </div>
      <div style={style.cell}>
        {format(data.created, "dd/MM/yyyy HH:mm:ss")}
      </div>
      <div style={style.cell}>
        <button
          onClick={() => {
            refetch({}, { fetchPolicy: "network-only" });
          }}
        >
          Refrescar
        </button>
      </div>
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
