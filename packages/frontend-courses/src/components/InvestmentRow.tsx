import React, { CSSProperties, FC } from "react";
import { graphql, useRefetchableFragment } from "react-relay";
import { InvestmentRowRefetchQuery } from "./__generated__/InvestmentRowRefetchQuery.graphql";
import { InvestmentRow_investment$key } from "./__generated__/InvestmentRow_investment.graphql";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faClipboard } from "@fortawesome/free-solid-svg-icons";
import { generateCurrency } from "utils";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [data, refetch] = useRefetchableFragment<
    InvestmentRowRefetchQuery,
    InvestmentRow_investment$key
  >(investmentRowRefetchableFragment, investment);
  const { ROI, term, payments, quantity } = data;
  const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
  const amortize = Math.floor(
    quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
  );
  const paid = generateCurrency(amortize * payments);
  const owes = generateCurrency(amortize * (term - payments));
  const interests = generateCurrency(amortize * term - quantity);
  const status = () => {
    switch (data.status) {
      case "DELAY_PAYMENT":
        return t("Atrasado");
      case "FINANCING":
        return t("Financiandose");
      case "PAID":
        return t("Pagado");
      case "PAST_DUE":
        return t("Vencido");
      case "UP_TO_DATE":
        return t("Al día");
      default:
        return "";
    }
  };
  const statusColor = () => {
    switch (data.status) {
      case "DELAY_PAYMENT":
        return "#FF9FF00";
      case "FINANCING":
        return "#4F7942";
      case "PAID":
        return "#046307";
      case "PAST_DUE":
        return "#CA3435";
      case "UP_TO_DATE":
        return "#44d43b";
      default:
        return "white";
    }
  };
  return (
    <div style={style.container}>
      <div style={style.clipboard}>
        <FontAwesomeIcon
          onClick={() => {
            navigator.clipboard.writeText(data.id);
          }}
          icon={faClipboard}
          size={"1x"}
          color={"rgba(90,96,255)"}
        />
      </div>
      <div style={style.clipboard}>
        <FontAwesomeIcon
          onClick={() => {
            navigator.clipboard.writeText(data._id_borrower);
          }}
          icon={faClipboard}
          size={"1x"}
          color={"rgba(90,96,255)"}
        />
      </div>
      <div style={style.clipboard}>
        <FontAwesomeIcon
          onClick={() => {
            navigator.clipboard.writeText(data._id_loan);
          }}
          icon={faClipboard}
          size={"1x"}
          color={"rgba(90,96,255)"}
        />
      </div>
      <div style={style.cell}>{generateCurrency(data.quantity)}</div>
      <div style={style.status}>
        <div
          style={{
            margin: "4px",
            backgroundColor: statusColor(),
            borderRadius: 4,
            textAlign: "center",
            flex: 1,
            padding: "3px 0px",
            color: "white",
          }}
        >
          {status()}
        </div>
      </div>
      <div style={style.cell}>{paid}</div>
      <div style={style.cell}>{owes}</div>
      <div style={style.cell}>{interests}</div>
      <div style={style.cell}>{data.moratory}</div>
      <div style={style.cell}>{format(data.updated, "dd/mm/yyyy")}</div>
      <div style={style.cell}>{format(data.created, "dd/MM/yyyy")}</div>
      <div
        style={style.clipboard}
        onClick={() => {
          refetch({}, { fetchPolicy: "network-only" });
        }}
      >
        <FontAwesomeIcon
          icon={faSyncAlt}
          size={"1x"}
          color={"rgb(90,96,255)"}
        />
      </div>
    </div>
  );
};

const style: Record<
  "cell" | "clipboard" | "container" | "status",
  CSSProperties
> = {
  cell: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
  },
  status: {
    flex: 1,
    backgroundColor: "white",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  clipboard: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
};
